import requests
from bs4 import BeautifulSoup
import json
import time

# Alternative health sources that are more accessible
ALTERNATIVE_SOURCES = [
    {
        "name": "NIH News",
        "url": "https://www.nih.gov/news-events/news-releases",
        "description": "NIH news and research updates"
    },
    {
        "name": "CDC News",
        "url": "https://www.cdc.gov/media/releases/",
        "description": "CDC news and health updates"
    },
    {
        "name": "WHO News",
        "url": "https://www.who.int/news",
        "description": "WHO global health news"
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

def extract_alternative_source(url, name, description):
    """Extract real data from alternative health sources"""
    try:
        print(f"Extracting data from {name}...")
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        
        soup = BeautifulSoup(resp.text, "lxml")
        data = {
            "source": name,
            "url": url,
            "description": description,
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
                    "title": f"Health Information {i+1}",
                    "content": items
                })
        
        print(f"✅ Successfully extracted {len(data['sections'])} sections from {name}")
        return data
        
    except Exception as e:
        print(f"❌ Error extracting from {name}: {e}")
        return None

def extract_all_alternative_data():
    """Extract real data from alternative health sources"""
    all_data = {
        "extraction_info": {
            "total_sources": len(ALTERNATIVE_SOURCES),
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_extractions": 0,
            "note": "Real health data from alternative accessible sources"
        },
        "sources": []
    }
    
    for source in ALTERNATIVE_SOURCES:
        data = extract_alternative_source(source["url"], source["name"], source["description"])
        if data:
            all_data["sources"].append(data)
            all_data["extraction_info"]["successful_extractions"] += 1
        
        # Be respectful - add delay between requests
        time.sleep(3)
    
    return all_data

if __name__ == "__main__":
    print("🌍 Starting alternative health data extraction...")
    print(f"📊 Targeting {len(ALTERNATIVE_SOURCES)} alternative sources...")
    
    alt_data = extract_all_alternative_data()
    
    # Save the alternative health data
    with open("alternative_health_data.json", "w", encoding="utf-8") as f:
        json.dump(alt_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Alternative health extraction complete!")
    print(f"📈 Successfully extracted from {alt_data['extraction_info']['successful_extractions']}/{alt_data['extraction_info']['total_sources']} sources")
    print(f"💾 Alternative health data saved to alternative_health_data.json")
    
    # Print summary
    total_sections = sum(len(source["sections"]) for source in alt_data["sources"])
    print(f"📝 Total sections extracted: {total_sections}")
    
    # Show sample content
    print(f"\n🔍 Sample alternative health content:")
    for source in alt_data["sources"][:2]:
        print(f"\n📋 {source['source']}:")
        for i, section in enumerate(source["sections"][:2]):
            print(f"  {i+1}. {section['title']}")
            for j, content in enumerate(section["content"][:1]):
                print(f"     - {content[:80]}...")
