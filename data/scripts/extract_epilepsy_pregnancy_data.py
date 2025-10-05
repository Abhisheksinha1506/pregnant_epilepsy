import requests
from bs4 import BeautifulSoup
import json
import time
import re

# Epilepsy and pregnancy resources
EPILEPSY_RESOURCES = [
    {
        "name": "Epilepsy Pregnancy Resources & Tools",
        "url": "https://epilepsypregnancy.com/resources-tools/",
        "description": "Comprehensive epilepsy and pregnancy resources and tools"
    },
    {
        "name": "Epilepsy Foundation Helpline",
        "url": "https://www.epilepsy.com/helpline",
        "description": "Epilepsy Foundation helpline and support resources"
    },
    {
        "name": "Epilepsy Learning Catalog",
        "url": "https://learn.epilepsy.com/collections/catalog",
        "description": "Epilepsy learning resources and educational materials"
    },
    {
        "name": "Epilepsy Action Plans",
        "url": "https://www.epilepsy.com/preparedness-safety/action-plans",
        "description": "Epilepsy preparedness and safety action plans"
    },
    {
        "name": "Empowering Epilepsy",
        "url": "https://www.empoweringepilepsy.org",
        "description": "Empowering Epilepsy community resources"
    },
    {
        "name": "Mother to Baby Fact Sheets",
        "url": "https://mothertobaby.org/fact-sheets/",
        "description": "Mother to Baby pregnancy and medication fact sheets"
    },
    {
        "name": "NCBI Epilepsy Resources",
        "url": "https://www.ncbi.nlm.nih.gov/books/NBK501922/",
        "description": "NCBI epilepsy and pregnancy medical information"
    },
    {
        "name": "Upstream Birth Control",
        "url": "https://birthcontrol.upstream.org/birthcontrol/",
        "description": "Birth control options and information"
    }
]

# PDF resources (these will need special handling)
PDF_RESOURCES = [
    {
        "name": "Epilepsy Pregnancy Delivery Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-pregnancy-delivery-doctors-questions-EPMC.pdf"
    },
    {
        "name": "Epilepsy Postpartum Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-postpartum-pregnancy-doctors-questions-EPMC.pdf"
    },
    {
        "name": "Anti-Seizure Medications Pregnancy Guide",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/what-we-know-asms-pregnancy-epilepsy-EPMC-1.pdf"
    },
    {
        "name": "Pregnancy Planning Calendar",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/pregnancy-planning-calendar-EPMC-1.pdf"
    },
    {
        "name": "Anti-Seizure Medication Tapering Schedule",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/anti-seizure-medications-pregnancy-tapering-schedule-EPMC-1.pdf"
    },
    {
        "name": "Birth Control Options for Epilepsy",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/what-we-know-birth-control-pregnancy-epilepsy-EPMC.pdf"
    },
    {
        "name": "Epilepsy Pregnancy Journey Planning",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-pregnancy-journey-planning.pdf"
    },
    {
        "name": "Epilepsy Diagnosis Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-diagnosis-pregnancy-doctors-questions-EPMC.pdf"
    },
    {
        "name": "Epilepsy Pregnancy Planning Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-pregnancy-planning-doctors-questions-EPMC.pdf"
    },
    {
        "name": "Seizure Event Diary",
        "url": "https://www.epilepsy.com/sites/default/files/atoms/files/721SED_MySeizureEventDiary_05-2019-B.pdf"
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

def fetch_page(url):
    """Fetch HTML content safely with error handling."""
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"⚠️ Error fetching {url}: {e}")
        return None

def extract_epilepsy_resource(url, name, description):
    """Extract epilepsy and pregnancy information from a resource."""
    html = fetch_page(url)
    if not html:
        return None
    
    soup = BeautifulSoup(html, "lxml")
    data = {
        "source": name,
        "url": url,
        "description": description,
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "epilepsy_pregnancy_info": []
    }
    
    # Extract main content
    main_content = soup.find("main") or soup.find("article") or soup.find("div", class_="content")
    if not main_content:
        main_content = soup
    
    # Look for epilepsy and pregnancy related content
    epilepsy_keywords = ["epilepsy", "seizure", "pregnancy", "medication", "anti-seizure", "ASM", "neurologist", "neurology", "epileptic", "seizure", "medication", "birth control", "contraception", "postpartum", "prenatal", "maternal", "fetal"]
    
    # Extract headings and content related to epilepsy and pregnancy
    for heading in main_content.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        title = heading.get_text(strip=True)
        if not title or len(title) < 3:
            continue
            
        # Check if content is epilepsy/pregnancy related
        is_epilepsy_related = any(keyword in title.lower() for keyword in epilepsy_keywords)
        
        content = []
        # Get content after this heading until next heading
        for sibling in heading.find_next_siblings():
            if sibling.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
                break
            if sibling.name in ["p", "ul", "ol", "div", "li"]:
                text = sibling.get_text(strip=True)
                if text and len(text) > 15:
                    # Check if content mentions epilepsy/pregnancy
                    if any(keyword in text.lower() for keyword in epilepsy_keywords):
                        content.append(text)
        
        if content and is_epilepsy_related:
            data["epilepsy_pregnancy_info"].append({
                "title": title,
                "content": content
            })
    
    # Extract any epilepsy/pregnancy related lists
    lists = main_content.find_all(["ul", "ol"])
    for i, list_elem in enumerate(lists):
        items = []
        for li in list_elem.find_all("li"):
            item_text = li.get_text(strip=True)
            if item_text and len(item_text) > 10:
                # Check if item is epilepsy/pregnancy related
                if any(keyword in item_text.lower() for keyword in epilepsy_keywords):
                    items.append(item_text)
        
        if items and len(items) > 1:
            data["epilepsy_pregnancy_info"].append({
                "title": f"Epilepsy & Pregnancy Information {i+1}",
                "content": items
            })
    
    # Extract epilepsy/pregnancy related links
    links = main_content.find_all("a", href=True)
    epilepsy_links = []
    for link in links:
        link_text = link.get_text(strip=True)
        href = link.get("href", "")
        if any(keyword in link_text.lower() or keyword in href.lower() 
               for keyword in epilepsy_keywords):
            epilepsy_links.append({
                "text": link_text,
                "url": href if href.startswith("http") else f"https://epilepsypregnancy.com{href}" if "epilepsypregnancy.com" in url else href
            })
    
    if epilepsy_links:
        data["epilepsy_pregnancy_info"].append({
            "title": "Epilepsy & Pregnancy Resources and Links",
            "content": [f"{link['text']}: {link['url']}" for link in epilepsy_links[:15]]
        })
    
    return data

def extract_pdf_resource(url, name):
    """Extract information from PDF resources (basic text extraction)."""
    try:
        print(f"📄 Attempting to extract from PDF: {name}")
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        
        # Basic text extraction from PDF (this is limited but better than nothing)
        content = resp.text if resp.text else "PDF content not extractable"
        
        return {
            "source": name,
            "url": url,
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "type": "PDF Resource",
            "content": content[:5000] if len(content) > 5000 else content,  # Limit content size
            "note": "PDF content extraction - may be limited"
        }
    except Exception as e:
        print(f"⚠️ Error extracting PDF {name}: {e}")
        return None

def extract_all_epilepsy_data():
    """Extract epilepsy and pregnancy data from all sources."""
    all_data = {
        "extraction_info": {
            "total_web_sources": len(EPILEPSY_RESOURCES),
            "total_pdf_sources": len(PDF_RESOURCES),
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_web_extractions": 0,
            "successful_pdf_extractions": 0,
            "note": "Comprehensive epilepsy and pregnancy data from specialized resources"
        },
        "web_sources": [],
        "pdf_sources": []
    }
    
    # Extract from web sources
    print("🌍 Extracting from web sources...")
    for source in EPILEPSY_RESOURCES:
        print(f"🔍 Extracting from {source['name']}...")
        data = extract_epilepsy_resource(source["url"], source["name"], source["description"])
        if data and data["epilepsy_pregnancy_info"]:
            all_data["web_sources"].append(data)
            all_data["extraction_info"]["successful_web_extractions"] += 1
            print(f"✅ Successfully extracted {len(data['epilepsy_pregnancy_info'])} sections from {source['name']}")
        else:
            print(f"⚠️ No epilepsy/pregnancy information found in {source['name']}")
        
        time.sleep(2)  # Be respectful
    
    # Extract from PDF sources
    print("\n📄 Extracting from PDF sources...")
    for pdf in PDF_RESOURCES:
        data = extract_pdf_resource(pdf["url"], pdf["name"])
        if data:
            all_data["pdf_sources"].append(data)
            all_data["extraction_info"]["successful_pdf_extractions"] += 1
            print(f"✅ Successfully extracted PDF: {pdf['name']}")
        else:
            print(f"⚠️ Failed to extract PDF: {pdf['name']}")
        
        time.sleep(2)  # Be respectful
    
    return all_data

if __name__ == "__main__":
    print("🌍 Starting comprehensive epilepsy and pregnancy data extraction...")
    print(f"📊 Targeting {len(EPILEPSY_RESOURCES)} web sources and {len(PDF_RESOURCES)} PDF sources...")
    
    epilepsy_data = extract_all_epilepsy_data()
    
    # Save the epilepsy and pregnancy data
    with open("epilepsy_pregnancy_comprehensive_data.json", "w", encoding="utf-8") as f:
        json.dump(epilepsy_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Epilepsy and pregnancy extraction complete!")
    print(f"📈 Successfully extracted from {epilepsy_data['extraction_info']['successful_web_extractions']}/{epilepsy_data['extraction_info']['total_web_sources']} web sources")
    print(f"📄 Successfully extracted from {epilepsy_data['extraction_info']['successful_pdf_extractions']}/{epilepsy_data['extraction_info']['total_pdf_sources']} PDF sources")
    print(f"💾 Comprehensive epilepsy and pregnancy data saved to epilepsy_pregnancy_comprehensive_data.json")
    
    # Print summary
    total_web_sections = sum(len(source["epilepsy_pregnancy_info"]) for source in epilepsy_data["web_sources"])
    print(f"📝 Total web sections extracted: {total_web_sections}")
    print(f"📄 Total PDF sources processed: {len(epilepsy_data['pdf_sources'])}")
    
    # Show sample content
    print(f"\n🔍 Sample epilepsy and pregnancy content:")
    for source in epilepsy_data["web_sources"][:2]:
        print(f"\n📋 {source['source']}:")
        for i, section in enumerate(source["epilepsy_pregnancy_info"][:2]):
            print(f"  {i+1}. {section['title']}")
            for j, content in enumerate(section["content"][:1]):
                print(f"     - {content[:80]}...")
    
    print(f"\n📄 PDF Sources:")
    for pdf in epilepsy_data["pdf_sources"][:3]:
        print(f"  - {pdf['source']}: {pdf['type']}")
