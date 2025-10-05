import requests
from bs4 import BeautifulSoup
import json
import time

# Drugs.com Pregnancy Categories
DRUGS_COM_URL = "https://www.drugs.com/pregnancy-categories.html"

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

def extract_pregnancy_categories():
    """Extract pregnancy categories data."""
    html = fetch_page(DRUGS_COM_URL)
    if not html:
        return None
    
    soup = BeautifulSoup(html, "lxml")
    data = {
        "source": "Drugs.com Pregnancy Categories",
        "url": DRUGS_COM_URL,
        "description": "FDA pregnancy risk categories for medications",
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "pregnancy_categories": []
    }
    
    # Extract pregnancy category information
    pregnancy_keywords = ["pregnancy", "category", "risk", "safety", "fetal", "birth", "defect", "teratogenic"]
    
    # Look for pregnancy category content
    main_content = soup.find("main") or soup.find("article") or soup.find("div", class_="content")
    if not main_content:
        main_content = soup
    
    # Extract headings and content related to pregnancy categories
    for heading in main_content.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        title = heading.get_text(strip=True)
        if not title or len(title) < 3:
            continue
            
        # Check if content is pregnancy category related
        is_pregnancy_related = any(keyword in title.lower() for keyword in pregnancy_keywords)
        
        content = []
        # Get content after this heading until next heading
        for sibling in heading.find_next_siblings():
            if sibling.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
                break
            if sibling.name in ["p", "ul", "ol", "div", "li"]:
                text = sibling.get_text(strip=True)
                if text and len(text) > 15:
                    # Check if content mentions pregnancy categories
                    if any(keyword in text.lower() for keyword in pregnancy_keywords):
                        content.append(text)
        
        if content and is_pregnancy_related:
            data["pregnancy_categories"].append({
                "title": title,
                "content": content
            })
    
    return data

def create_comprehensive_pregnancy_categories():
    """Create comprehensive pregnancy categories database."""
    print("🌍 Creating comprehensive pregnancy categories database...")
    
    pregnancy_categories_data = {
        "source": "Comprehensive Pregnancy Categories Database",
        "description": "FDA pregnancy risk categories and safety information for medications",
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "pregnancy_categories": [
            {
                "category": "Category A",
                "description": "Adequate and well-controlled studies have failed to demonstrate a risk to the fetus in the first trimester of pregnancy",
                "risk_level": "Lowest Risk",
                "examples": [
                    "Folic acid",
                    "Thyroid hormone (when used appropriately)",
                    "Some vitamins and minerals"
                ],
                "notes": "Very few medications fall into this category"
            },
            {
                "category": "Category B",
                "description": "Animal reproduction studies have failed to demonstrate a risk to the fetus and there are no adequate and well-controlled studies in pregnant women",
                "risk_level": "Low Risk",
                "examples": [
                    "Some antibiotics (penicillin, amoxicillin)",
                    "Some antihistamines",
                    "Some pain medications"
                ],
                "notes": "Generally considered safe during pregnancy"
            },
            {
                "category": "Category C",
                "description": "Animal reproduction studies have shown an adverse effect on the fetus and there are no adequate and well-controlled studies in humans",
                "risk_level": "Moderate Risk",
                "examples": [
                    "Lamotrigine (Lamictal)",
                    "Levetiracetam (Keppra)",
                    "Many other medications"
                ],
                "notes": "Use only if potential benefit justifies potential risk"
            },
            {
                "category": "Category D",
                "description": "There is positive evidence of human fetal risk, but the benefits from use in pregnant women may be acceptable despite the risk",
                "risk_level": "High Risk",
                "examples": [
                    "Valproic acid (Depakote)",
                    "Carbamazepine (Tegretol)",
                    "Phenytoin (Dilantin)"
                ],
                "notes": "Use only if no safer alternative exists"
            },
            {
                "category": "Category X",
                "description": "Studies in animals or humans have demonstrated fetal abnormalities and/or there is positive evidence of human fetal risk",
                "risk_level": "Contraindicated",
                "examples": [
                    "Isotretinoin (Accutane)",
                    "Thalidomide",
                    "Some chemotherapy drugs"
                ],
                "notes": "Should not be used during pregnancy"
            }
        ],
        "epilepsy_medication_categories": [
            {
                "medication": "Lamotrigine",
                "category": "Category C",
                "safety_notes": "Generally considered safer for pregnancy, may require dose adjustments"
            },
            {
                "medication": "Levetiracetam",
                "category": "Category C",
                "safety_notes": "Generally considered safer for pregnancy, good seizure control"
            },
            {
                "medication": "Valproic Acid",
                "category": "Category D",
                "safety_notes": "High risk of birth defects, should be avoided if possible"
            },
            {
                "medication": "Carbamazepine",
                "category": "Category D",
                "safety_notes": "Risk of neural tube defects, requires folic acid"
            },
            {
                "medication": "Phenytoin",
                "category": "Category D",
                "safety_notes": "Risk of fetal hydantoin syndrome, requires monitoring"
            }
        ],
        "general_guidelines": [
            "Pre-pregnancy counseling is essential",
            "Folic acid supplementation (5mg daily) before conception",
            "Regular monitoring of medication levels",
            "Multidisciplinary team approach",
            "Consider medication changes before pregnancy if possible",
            "Detailed anomaly scan at 18-20 weeks gestation",
            "Close monitoring throughout pregnancy"
        ]
    }
    
    return pregnancy_categories_data

if __name__ == "__main__":
    print("🌍 Starting pregnancy categories extraction...")
    
    # Try to extract from Drugs.com
    try:
        categories_data = extract_pregnancy_categories()
        if categories_data and categories_data["pregnancy_categories"]:
            with open("../drugs_com_pregnancy_categories.json", "w", encoding="utf-8") as f:
                json.dump(categories_data, f, indent=2, ensure_ascii=False)
            print(f"✅ Drugs.com pregnancy categories saved to drugs_com_pregnancy_categories.json")
        else:
            print("⚠️ No data extracted from Drugs.com, creating comprehensive database instead")
    except Exception as e:
        print(f"⚠️ Drugs.com extraction failed: {e}")
        print("Creating comprehensive pregnancy categories database instead")
    
    # Create comprehensive pregnancy categories database
    comprehensive_categories = create_comprehensive_pregnancy_categories()
    
    with open("../comprehensive_pregnancy_categories.json", "w", encoding="utf-8") as f:
        json.dump(comprehensive_categories, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Comprehensive pregnancy categories database created!")
    print(f"📈 Successfully created database with {len(comprehensive_categories['pregnancy_categories'])} categories")
    print(f"💾 Pregnancy categories database saved to comprehensive_pregnancy_categories.json")
    
    # Show sample content
    print(f"\n🔍 Sample pregnancy categories content:")
    for i, category in enumerate(comprehensive_categories["pregnancy_categories"][:3]):
        print(f"{i+1}. {category['category']} - {category['risk_level']}")
        print(f"   Description: {category['description'][:80]}...")
        print(f"   Examples: {', '.join(category['examples'][:2])}")
