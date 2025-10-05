import requests
from bs4 import BeautifulSoup
import json
import time

# Additional pregnancy and maternal health sources
ADDITIONAL_SOURCES = [
    {
        "name": "Mayo Clinic Pregnancy",
        "url": "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week",
        "description": "Mayo Clinic pregnancy week-by-week guide"
    },
    {
        "name": "WebMD Pregnancy",
        "url": "https://www.webmd.com/baby/pregnancy-guide",
        "description": "WebMD comprehensive pregnancy guide"
    },
    {
        "name": "Healthline Pregnancy",
        "url": "https://www.healthline.com/health/pregnancy",
        "description": "Healthline pregnancy health information"
    },
    {
        "name": "Cleveland Clinic Pregnancy",
        "url": "https://my.clevelandclinic.org/health/articles/9709-pregnancy",
        "description": "Cleveland Clinic pregnancy resources"
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

def extract_additional_sources():
    """Extract data from additional pregnancy sources"""
    all_data = {
        "extraction_info": {
            "total_sources": len(ADDITIONAL_SOURCES),
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_extractions": 0
        },
        "sources": []
    }
    
    for source in ADDITIONAL_SOURCES:
        try:
            print(f"Extracting data from {source['name']}...")
            resp = requests.get(source["url"], headers=headers, timeout=15)
            resp.raise_for_status()
            
            soup = BeautifulSoup(resp.text, "lxml")
            data = {
                "source": source["name"],
                "url": source["url"],
                "description": source["description"],
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
                        "title": f"Important Information {i+1}",
                        "content": items
                    })
            
            if data["sections"]:
                all_data["sources"].append(data)
                all_data["extraction_info"]["successful_extractions"] += 1
                print(f"✅ Successfully extracted {len(data['sections'])} sections from {source['name']}")
            else:
                print(f"⚠️ No content extracted from {source['name']}")
                
        except Exception as e:
            print(f"❌ Error with {source['name']}: {e}")
        
        # Be respectful - add delay between requests
        time.sleep(3)
    
    return all_data

if __name__ == "__main__":
    print("🌍 Starting additional pregnancy data extraction...")
    print(f"📊 Targeting {len(ADDITIONAL_SOURCES)} additional sources...")
    
    additional_data = extract_additional_sources()
    
    # Save the additional data
    with open("additional_pregnancy_data.json", "w", encoding="utf-8") as f:
        json.dump(additional_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Additional extraction complete!")
    print(f"📈 Successfully extracted from {additional_data['extraction_info']['successful_extractions']}/{additional_data['extraction_info']['total_sources']} sources")
    print(f"💾 Data saved to additional_pregnancy_data.json")
    
    # Print summary
    total_sections = sum(len(source["sections"]) for source in additional_data["sources"])
    print(f"📝 Total sections extracted: {total_sections}")
