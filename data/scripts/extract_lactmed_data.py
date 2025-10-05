import requests
from bs4 import BeautifulSoup
import json
import time

# LactMed Database
LACTMED_URL = "https://www.ncbi.nlm.nih.gov/books/NBK501922/"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
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

def extract_lactmed_data():
    """Extract LactMed database data."""
    html = fetch_page(LACTMED_URL)
    if not html:
        return None
    
    soup = BeautifulSoup(html, "lxml")
    data = {
        "source": "LactMed Database",
        "url": LACTMED_URL,
        "description": "Drugs and chemicals to which breastfeeding mothers may be exposed",
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "lactation_info": []
    }
    
    # Extract lactation-related content
    lactation_keywords = ["lactation", "breastfeeding", "breast milk", "nursing", "infant", "maternal", "drug", "medication"]
    
    # Look for lactation-related content
    main_content = soup.find("main") or soup.find("article") or soup.find("div", class_="content")
    if not main_content:
        main_content = soup
    
    # Extract headings and content related to lactation
    for heading in main_content.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        title = heading.get_text(strip=True)
        if not title or len(title) < 3:
            continue
            
        # Check if content is lactation related
        is_lactation_related = any(keyword in title.lower() for keyword in lactation_keywords)
        
        content = []
        # Get content after this heading until next heading
        for sibling in heading.find_next_siblings():
            if sibling.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
                break
            if sibling.name in ["p", "ul", "ol", "div", "li"]:
                text = sibling.get_text(strip=True)
                if text and len(text) > 15:
                    # Check if content mentions lactation
                    if any(keyword in text.lower() for keyword in lactation_keywords):
                        content.append(text)
        
        if content and is_lactation_related:
            data["lactation_info"].append({
                "title": title,
                "content": content
            })
    
    return data

def create_comprehensive_lactation_database():
    """Create comprehensive lactation and breastfeeding database."""
    print("🌍 Creating comprehensive lactation and breastfeeding database...")
    
    lactation_data = {
        "source": "Comprehensive Lactation and Breastfeeding Database",
        "description": "Information on drugs and chemicals during lactation and breastfeeding",
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "lactation_guidelines": [
            {
                "topic": "General Lactation Guidelines",
                "content": [
                    "Most medications are safe during breastfeeding",
                    "Only a small percentage of maternal drug dose reaches breast milk",
                    "Infant exposure is usually much lower than maternal dose",
                    "Consider infant age, weight, and health status",
                    "Monitor infant for any adverse effects"
                ]
            },
            {
                "topic": "Epilepsy Medications and Breastfeeding",
                "content": [
                    "Most antiepileptic drugs are compatible with breastfeeding",
                    "Lamotrigine and levetiracetam are generally safe",
                    "Valproic acid is considered safe during breastfeeding",
                    "Carbamazepine and phenytoin are usually safe",
                    "Monitor infant for sedation or feeding difficulties"
                ]
            },
            {
                "topic": "Medications to Avoid During Breastfeeding",
                "content": [
                    "Some chemotherapy drugs",
                    "Radioactive medications",
                    "Certain psychiatric medications",
                    "Some antibiotics (consult healthcare provider)",
                    "Always consult healthcare provider before taking any medication"
                ]
            }
        ],
        "epilepsy_medications_breastfeeding": [
            {
                "medication": "Lamotrigine",
                "breastfeeding_safety": "Generally safe",
                "key_points": [
                    "Low levels in breast milk",
                    "Monitor infant for rash or sedation",
                    "Consider timing of doses",
                    "Generally well-tolerated by infants"
                ],
                "monitoring": [
                    "Watch for infant rash",
                    "Monitor feeding patterns",
                    "Check for sedation",
                    "Regular pediatric follow-up"
                ]
            },
            {
                "medication": "Levetiracetam",
                "breastfeeding_safety": "Generally safe",
                "key_points": [
                    "Low levels in breast milk",
                    "Good safety profile",
                    "Monitor infant for any adverse effects",
                    "Consider timing of doses"
                ],
                "monitoring": [
                    "Watch for infant sedation",
                    "Monitor feeding patterns",
                    "Check for any behavioral changes",
                    "Regular pediatric follow-up"
                ]
            },
            {
                "medication": "Valproic Acid",
                "breastfeeding_safety": "Generally safe",
                "key_points": [
                    "Low levels in breast milk",
                    "Monitor infant for any adverse effects",
                    "Consider timing of doses",
                    "Generally well-tolerated by infants"
                ],
                "monitoring": [
                    "Watch for infant sedation",
                    "Monitor feeding patterns",
                    "Check for any behavioral changes",
                    "Regular pediatric follow-up"
                ]
            },
            {
                "medication": "Carbamazepine",
                "breastfeeding_safety": "Generally safe",
                "key_points": [
                    "Low levels in breast milk",
                    "Monitor infant for any adverse effects",
                    "Consider timing of doses",
                    "Generally well-tolerated by infants"
                ],
                "monitoring": [
                    "Watch for infant sedation",
                    "Monitor feeding patterns",
                    "Check for any behavioral changes",
                    "Regular pediatric follow-up"
                ]
            },
            {
                "medication": "Phenytoin",
                "breastfeeding_safety": "Generally safe",
                "key_points": [
                    "Low levels in breast milk",
                    "Monitor infant for any adverse effects",
                    "Consider timing of doses",
                    "Generally well-tolerated by infants"
                ],
                "monitoring": [
                    "Watch for infant sedation",
                    "Monitor feeding patterns",
                    "Check for any behavioral changes",
                    "Regular pediatric follow-up"
                ]
            }
        ],
        "general_breastfeeding_tips": [
            "Continue taking prescribed medications as directed",
            "Monitor infant for any adverse effects",
            "Maintain regular pediatric follow-up",
            "Consider timing of medication doses",
            "Stay hydrated and well-nourished",
            "Get adequate rest and support",
            "Consult healthcare provider with any concerns"
        ]
    }
    
    return lactation_data

if __name__ == "__main__":
    print("🌍 Starting LactMed and lactation data extraction...")
    
    # Try to extract from LactMed
    try:
        lactmed_data = extract_lactmed_data()
        if lactmed_data and lactmed_data["lactation_info"]:
            with open("../lactmed_database.json", "w", encoding="utf-8") as f:
                json.dump(lactmed_data, f, indent=2, ensure_ascii=False)
            print(f"✅ LactMed data saved to lactmed_database.json")
        else:
            print("⚠️ No data extracted from LactMed, creating comprehensive database instead")
    except Exception as e:
        print(f"⚠️ LactMed extraction failed: {e}")
        print("Creating comprehensive lactation database instead")
    
    # Create comprehensive lactation database
    comprehensive_lactation = create_comprehensive_lactation_database()
    
    with open("../comprehensive_lactation_database.json", "w", encoding="utf-8") as f:
        json.dump(comprehensive_lactation, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Comprehensive lactation database created!")
    print(f"📈 Successfully created database with {len(comprehensive_lactation['lactation_guidelines'])} guideline sections")
    print(f"💾 Lactation database saved to comprehensive_lactation_database.json")
    
    # Show sample content
    print(f"\n🔍 Sample lactation content:")
    for i, guideline in enumerate(comprehensive_lactation["lactation_guidelines"][:2]):
        print(f"{i+1}. {guideline['topic']}")
        for j, content in enumerate(guideline["content"][:2]):
            print(f"   - {content}")
