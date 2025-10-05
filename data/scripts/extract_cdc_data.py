import requests
from bs4 import BeautifulSoup
import json

URL = "https://www.cdc.gov/medicine-and-pregnancy/about/index.html"
headers = {"User-Agent": "Mozilla/5.0 (compatible; DataExtractor/1.0)"}

def extract_cdc_page(url):
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "lxml")
    data = {"url": url, "sections": []}

    # Extract headings and their paragraphs
    for section in soup.find_all(["h2", "h3"]):
        title = section.get_text(strip=True)
        content = []
        for sib in section.find_next_siblings():
            if sib.name in ["h2", "h3"]:  # stop at next section
                break
            if sib.name in ["p", "ul", "ol"]:
                content.append(sib.get_text(" ", strip=True))
        data["sections"].append({"title": title, "content": content})
    return data

if __name__ == "__main__":
    cdc_data = extract_cdc_page(URL)
    with open("cdc_medicine_pregnancy.json", "w", encoding="utf-8") as f:
        json.dump(cdc_data, f, indent=2, ensure_ascii=False)
    print("✅ CDC data saved to cdc_medicine_pregnancy.json")
