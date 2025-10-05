#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'

const repoRoot = process.cwd()
const includeExt = new Set(['.ts', '.tsx', '.js', '.jsx'])
const excludeDirs = new Set(['node_modules', '.git', 'dist', 'build'])

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (excludeDirs.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else {
      const ext = path.extname(entry.name)
      if (includeExt.has(ext)) yield full
    }
  }
}

const urlRegex = /https?:\/\/[^\s"'<>\)]+/g

async function collectUrls() {
  const urlToFiles = new Map()
  for await (const file of walk(repoRoot)) {
    const text = await fs.readFile(file, 'utf8')
    const matches = text.match(urlRegex) || []
    for (const raw of matches) {
      const url = raw.replace(/[),.;]+$/g, '')
      if (!urlToFiles.has(url)) urlToFiles.set(url, new Set())
      urlToFiles.get(url).add(path.relative(repoRoot, file))
    }
  }
  return urlToFiles
}

async function checkUrl(url, signal) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal })
    // Some servers don't support HEAD correctly; fallback to GET on 405/403
    if (res.status === 405 || res.status === 403) {
      const resGet = await fetch(url, { method: 'GET', redirect: 'follow', signal })
      return { status: resGet.status, finalUrl: resGet.url }
    }
    return { status: res.status, finalUrl: res.url }
  } catch (e) {
    return { status: 0, error: e?.message || String(e) }
  }
}

async function main() {
  const urlToFiles = await collectUrls()
  const urls = Array.from(urlToFiles.keys())
  const results = []
  const controller = new AbortController()
  const { signal } = controller
  const concurrency = 8
  let i = 0

  async function worker() {
    while (true) {
      const idx = i++
      if (idx >= urls.length) break
      const url = urls[idx]
      const res = await checkUrl(url, signal)
      results.push({ url, ...res, files: Array.from(urlToFiles.get(url)) })
      const status = res.status
      const tag = status === 0 ? 'ERR' : status >= 200 && status < 400 ? 'OK ' : 'BAD'
      console.log(`[${tag}] ${status} ${url}`)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))

  const broken = results.filter(r => !(r.status >= 200 && r.status < 400))
  const report = { checked: results.length, ok: results.length - broken.length, broken }
  await fs.writeFile(path.join(repoRoot, 'link-check-report.json'), JSON.stringify(report, null, 2))
  console.log(`\nSummary: checked=${report.checked} ok=${report.ok} broken=${broken.length}`)
  if (broken.length) {
    console.log(`Broken details written to link-check-report.json`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


