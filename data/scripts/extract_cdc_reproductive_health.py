import requests
from bs4 import BeautifulSoup
import json
import time

# Working CDC reproductive health URL
CDC_URL = "https://www.cdc.gov/reproductivehealth/index.html"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

def extract_cdc_reproductive_health():
    """Extract real data from CDC reproductive health page"""
    try:
        print("Extracting data from CDC Reproductive Health page...")
        resp = requests.get(CDC_URL, headers=headers, timeout=15)
        resp.raise_for_status()
        
        soup = BeautifulSoup(resp.text, "lxml")
        data = {
            "source": "CDC Reproductive Health",
            "url": CDC_URL,
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "sections": []
        }
        
        # Extract main content
        main_content = soup.find("main") or soup.find("article") or soup.find("div", class_="content")
        if not main_content:
            main_content = soup
        
        # Extract headings and their content
        for heading in main_content.find_all(["h1", "h2", "h3", "h4"]):
            title = heading.get_text(strip=True)
            if not title or len(title) < 3:
                continue
                
            content = []
            # Get content after this heading until next heading
            for sibling in heading.find_next_siblings():
                if sibling.name in ["h1", "h2", "h3", "h4"]:
                    break
                if sibling.name in ["p", "ul", "ol", "div"]:
                    text = sibling.get_text(strip=True)
                    if text and len(text) > 15:  # Filter out very short text
                        content.append(text)
            
            if content:
                data["sections"].append({
                    "title": title,
                    "content": content
                })
        
        # Extract any important lists
        lists = main_content.find_all(["ul", "ol"])
        for i, list_elem in enumerate(lists):
            items = []
            for li in list_elem.find_all("li"):
                item_text = li.get_text(strip=True)
                if item_text and len(item_text) > 10:
                    items.append(item_text)
            
            if items and len(items) > 1:  # Only include lists with multiple items
                data["sections"].append({
                    "title": f"CDC Reproductive Health Information {i+1}",
                    "content": items
                })
        
        # Extract any links to pregnancy/maternal health topics
        links = main_content.find_all("a", href=True)
        pregnancy_links = []
        for link in links:
            link_text = link.get_text(strip=True)
            href = link.get("href", "")
            if any(keyword in link_text.lower() or keyword in href.lower() 
                   for keyword in ["pregnancy", "maternal", "prenatal", "pregnant", "baby", "infant", "reproductive"]):
                pregnancy_links.append({
                    "text": link_text,
                    "url": href if href.startswith("http") else f"https://www.cdc.gov{href}"
                })
        
        if pregnancy_links:
            data["sections"].append({
                "title": "CDC Reproductive Health Resources",
                "content": [f"{link['text']}: {link['url']}" for link in pregnancy_links]
            })
        
        print(f"✅ Successfully extracted {len(data['sections'])} sections from CDC Reproductive Health")
        return data
        
    except Exception as e:
        print(f"❌ Error extracting CDC data: {e}")
        return None

if __name__ == "__main__":
    print("🌍 Extracting real CDC reproductive health data...")
    
    cdc_data = extract_cdc_reproductive_health()
    
    if cdc_data:
        # Save the CDC data
        with open("cdc_reproductive_health_data.json", "w", encoding="utf-8") as f:
            json.dump(cdc_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ CDC extraction complete!")
        print(f"📈 Successfully extracted {len(cdc_data['sections'])} sections")
        print(f"💾 Data saved to cdc_reproductive_health_data.json")
        
        # Print summary
        total_content = sum(len(section["content"]) for section in cdc_data["sections"])
        print(f"📝 Total content items: {total_content}")
        
        # Show sample content
        print(f"\n🔍 Sample content:")
        for i, section in enumerate(cdc_data["sections"][:3]):
            print(f"{i+1}. {section['title']}")
            for j, content in enumerate(section["content"][:2]):
                print(f"   - {content[:80]}...")
    else:
        print("❌ Failed to extract CDC data")
