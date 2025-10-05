import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse

# List of pregnancy and maternal health websites
PREGNANCY_WEBSITES = [
    {
        "name": "CDC Pregnancy",
        "url": "https://www.cdc.gov/reproductivehealth/maternalinfanthealth/index.html",
        "selectors": ["h2", "h3", "p", "ul", "ol"]
    },
    {
        "name": "March of Dimes",
        "url": "https://www.marchofdimes.org/pregnancy",
        "selectors": ["h2", "h3", "p", "ul", "ol"]
    },
    {
        "name": "American Pregnancy Association",
        "url": "https://americanpregnancy.org/",
        "selectors": ["h2", "h3", "p", "ul", "ol"]
    },
    {
        "name": "NIH Pregnancy",
        "url": "https://www.nichd.nih.gov/health/topics/pregnancy",
        "selectors": ["h2", "h3", "p", "ul", "ol"]
    },
    {
        "name": "WHO Maternal Health",
        "url": "https://www.who.int/health-topics/maternal-health",
        "selectors": ["h2", "h3", "p", "ul", "ol"]
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

def extract_website_data(url, name, selectors):
    """Extract data from a single website"""
    try:
        print(f"Extracting data from {name}...")
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        
        soup = BeautifulSoup(resp.text, "lxml")
        data = {
            "source": name,
            "url": url,
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
            if not title:
                continue
                
            content = []
            # Get content after this heading until next heading
            for sibling in heading.find_next_siblings():
                if sibling.name in ["h1", "h2", "h3", "h4"]:
                    break
                if sibling.name in ["p", "ul", "ol", "div"]:
                    text = sibling.get_text(strip=True)
                    if text and len(text) > 10:  # Filter out very short text
                        content.append(text)
            
            if content:
                data["sections"].append({
                    "title": title,
                    "content": content
                })
        
        # Extract any lists that might contain important information
        lists = main_content.find_all(["ul", "ol"])
        for i, list_elem in enumerate(lists):
            items = []
            for li in list_elem.find_all("li"):
                item_text = li.get_text(strip=True)
                if item_text and len(item_text) > 5:
                    items.append(item_text)
            
            if items:
                data["sections"].append({
                    "title": f"List {i+1}",
                    "content": items
                })
        
        print(f"✅ Successfully extracted {len(data['sections'])} sections from {name}")
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error accessing {name}: {e}")
        return None
    except Exception as e:
        print(f"❌ Error processing {name}: {e}")
        return None

def extract_all_pregnancy_data():
    """Extract data from all pregnancy-related websites"""
    all_data = {
        "extraction_info": {
            "total_sources": len(PREGNANCY_WEBSITES),
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_extractions": 0
        },
        "sources": []
    }
    
    for site in PREGNANCY_WEBSITES:
        data = extract_website_data(site["url"], site["name"], site["selectors"])
        if data:
            all_data["sources"].append(data)
            all_data["extraction_info"]["successful_extractions"] += 1
        
        # Be respectful - add delay between requests
        time.sleep(2)
    
    return all_data

if __name__ == "__main__":
    print("🌍 Starting comprehensive pregnancy data extraction...")
    print(f"📊 Targeting {len(PREGNANCY_WEBSITES)} sources...")
    
    pregnancy_data = extract_all_pregnancy_data()
    
    # Save the comprehensive data
    with open("comprehensive_pregnancy_data.json", "w", encoding="utf-8") as f:
        json.dump(pregnancy_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Extraction complete!")
    print(f"📈 Successfully extracted from {pregnancy_data['extraction_info']['successful_extractions']}/{pregnancy_data['extraction_info']['total_sources']} sources")
    print(f"💾 Data saved to comprehensive_pregnancy_data.json")
    
    # Print summary
    total_sections = sum(len(source["sections"]) for source in pregnancy_data["sources"])
    print(f"📝 Total sections extracted: {total_sections}")
