import requests
from bs4 import BeautifulSoup
import json
import time

# Alternative drug safety sources that are more accessible
DRUG_SAFETY_SOURCES = [
    {
        "name": "NIH Drug Information",
        "url": "https://www.nih.gov/news-events/news-releases",
        "description": "NIH news and drug research updates"
    },
    {
        "name": "CDC Drug Safety",
        "url": "https://www.cdc.gov/media/releases/",
        "description": "CDC drug safety and health updates"
    },
    {
        "name": "WHO Drug Safety",
        "url": "https://www.who.int/news",
        "description": "WHO global drug safety information"
    }
]

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

def extract_drug_safety_source(url, name, description):
    """Extract drug safety data from alternative sources"""
    try:
        print(f"Extracting drug safety data from {name}...")
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        
        soup = BeautifulSoup(resp.text, "lxml")
        data = {
            "source": name,
            "url": url,
            "description": description,
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "drug_safety_info": []
        }
        
        # Extract main content
        main_content = soup.find("main") or soup.find("article") or soup.find("div", class_="content")
        if not main_content:
            main_content = soup
        
        # Look for drug-related content
        drug_keywords = ["drug", "medication", "pharmaceutical", "safety", "adverse", "side effect", "warning", "recall"]
        
        # Extract headings and content related to drugs
        for heading in main_content.find_all(["h1", "h2", "h3", "h4"]):
            title = heading.get_text(strip=True)
            if not title or len(title) < 3:
                continue
                
            # Check if content is drug-related
            is_drug_related = any(keyword in title.lower() for keyword in drug_keywords)
            
            content = []
            # Get content after this heading until next heading
            for sibling in heading.find_next_siblings():
                if sibling.name in ["h1", "h2", "h3", "h4"]:
                    break
                if sibling.name in ["p", "ul", "ol", "div"]:
                    text = sibling.get_text(strip=True)
                    if text and len(text) > 15:
                        # Check if content mentions drugs
                        if any(keyword in text.lower() for keyword in drug_keywords):
                            content.append(text)
            
            if content and is_drug_related:
                data["drug_safety_info"].append({
                    "title": title,
                    "content": content
                })
        
        # Extract any drug-related lists
        lists = main_content.find_all(["ul", "ol"])
        for i, list_elem in enumerate(lists):
            items = []
            for li in list_elem.find_all("li"):
                item_text = li.get_text(strip=True)
                if item_text and len(item_text) > 10:
                    # Check if item is drug-related
                    if any(keyword in item_text.lower() for keyword in drug_keywords):
                        items.append(item_text)
            
            if items and len(items) > 1:
                data["drug_safety_info"].append({
                    "title": f"Drug Safety Information {i+1}",
                    "content": items
                })
        
        # Extract drug-related links
        links = main_content.find_all("a", href=True)
        drug_links = []
        for link in links:
            link_text = link.get_text(strip=True)
            href = link.get("href", "")
            if any(keyword in link_text.lower() or keyword in href.lower() 
                   for keyword in drug_keywords):
                drug_links.append({
                    "text": link_text,
                    "url": href if href.startswith("http") else f"https://www.nih.gov{href}" if "nih" in url else f"https://www.cdc.gov{href}" if "cdc" in url else href
                })
        
        if drug_links:
            data["drug_safety_info"].append({
                "title": "Drug Safety Resources and Links",
                "content": [f"{link['text']}: {link['url']}" for link in drug_links[:10]]
            })
        
        print(f"✅ Successfully extracted {len(data['drug_safety_info'])} drug safety sections from {name}")
        return data
        
    except Exception as e:
        print(f"❌ Error extracting from {name}: {e}")
        return None

def extract_all_drug_safety_data():
    """Extract drug safety data from all sources"""
    all_data = {
        "extraction_info": {
            "total_sources": len(DRUG_SAFETY_SOURCES),
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_extractions": 0,
            "note": "Real drug safety data from alternative accessible sources"
        },
        "sources": []
    }
    
    for source in DRUG_SAFETY_SOURCES:
        data = extract_drug_safety_source(source["url"], source["name"], source["description"])
        if data:
            all_data["sources"].append(data)
            all_data["extraction_info"]["successful_extractions"] += 1
        
        # Be respectful - add delay between requests
        time.sleep(3)
    
    return all_data

if __name__ == "__main__":
    print("🌍 Starting drug safety data extraction...")
    print(f"📊 Targeting {len(DRUG_SAFETY_SOURCES)} drug safety sources...")
    
    drug_data = extract_all_drug_safety_data()
    
    # Save the drug safety data
    with open("drug_safety_data.json", "w", encoding="utf-8") as f:
        json.dump(drug_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Drug safety extraction complete!")
    print(f"📈 Successfully extracted from {drug_data['extraction_info']['successful_extractions']}/{drug_data['extraction_info']['total_sources']} sources")
    print(f"💾 Drug safety data saved to drug_safety_data.json")
    
    # Print summary
    total_sections = sum(len(source["drug_safety_info"]) for source in drug_data["sources"])
    print(f"📝 Total drug safety sections extracted: {total_sections}")
    
    # Show sample content
    print(f"\n🔍 Sample drug safety content:")
    for source in drug_data["sources"][:2]:
        print(f"\n📋 {source['source']}:")
        for i, section in enumerate(source["drug_safety_info"][:2]):
            print(f"  {i+1}. {section['title']}")
            for j, content in enumerate(section["content"][:1]):
                print(f"     - {content[:80]}...")
