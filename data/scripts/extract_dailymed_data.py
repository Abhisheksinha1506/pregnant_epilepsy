import requests
import json
import time

# DailyMed API for medication safety data
DAILYMED_BASE_URL = "https://dailymed.nlm.nih.gov/dailymed/services/v2"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.5",
}

def fetch_dailymed_data():
    """Fetch medication safety data from DailyMed API."""
    print("🌍 Extracting DailyMed medication safety data...")
    
    # Common epilepsy medications to search for
    epilepsy_medications = [
        "lamotrigine", "levetiracetam", "valproic acid", "carbamazepine", 
        "phenytoin", "topiramate", "gabapentin", "pregabalin", "oxcarbazepine",
        "zonisamide", "lacosamide", "perampanel", "brivaracetam", "eslicarbazepine"
    ]
    
    dailymed_data = {
        "source": "DailyMed API",
        "url": "https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm",
        "description": "Medication safety data from DailyMed API for epilepsy medications",
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "medications": []
    }
    
    for medication in epilepsy_medications:
        try:
            print(f"🔍 Searching for {medication}...")
            
            # Search for medication
            search_url = f"{DAILYMED_BASE_URL}/drugs.json"
            params = {
                "drug_name": medication,
                "pagesize": 5
            }
            
            response = requests.get(search_url, headers=headers, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                if "data" in data and len(data["data"]) > 0:
                    for drug in data["data"][:2]:  # Limit to 2 results per medication
                        drug_info = {
                            "medication_name": medication,
                            "set_id": drug.get("setid", ""),
                            "spl_id": drug.get("spl_id", ""),
                            "drug_name": drug.get("drug_name", ""),
                            "active_ingredient": drug.get("active_ingredient", ""),
                            "pregnancy_category": "See labeling for pregnancy information",
                            "safety_info": "Comprehensive safety information available in full labeling"
                        }
                        
                        # Try to get more detailed information
                        if drug.get("setid"):
                            detail_url = f"{DAILYMED_BASE_URL}/drugs/{drug['setid']}.json"
                            try:
                                detail_response = requests.get(detail_url, headers=headers, timeout=10)
                                if detail_response.status_code == 200:
                                    detail_data = detail_response.json()
                                    if "drug" in detail_data:
                                        drug_detail = detail_data["drug"]
                                        drug_info.update({
                                            "manufacturer": drug_detail.get("manufacturer", ""),
                                            "ndc": drug_detail.get("ndc", ""),
                                            "pregnancy_info": "Detailed pregnancy information available in full drug labeling"
                                        })
                            except Exception as e:
                                print(f"⚠️ Could not fetch details for {medication}: {e}")
                        
                        dailymed_data["medications"].append(drug_info)
                        print(f"✅ Found data for {medication}")
                else:
                    print(f"⚠️ No data found for {medication}")
            else:
                print(f"⚠️ API request failed for {medication}: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error searching for {medication}: {e}")
        
        # Be respectful to the API
        time.sleep(1)
    
    return dailymed_data

def create_epilepsy_medication_safety_database():
    """Create comprehensive epilepsy medication safety database."""
    print("🌍 Creating epilepsy medication safety database...")
    
    # Based on medical literature and guidelines
    epilepsy_meds_safety = {
        "source": "Epilepsy Medication Safety Database",
        "description": "Comprehensive safety information for epilepsy medications during pregnancy",
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "medications": [
            {
                "medication": "Lamotrigine",
                "brand_names": ["Lamictal"],
                "pregnancy_category": "Category C",
                "safety_profile": "Generally considered safer during pregnancy",
                "key_points": [
                    "Lower risk of major congenital malformations compared to valproate",
                    "May require dose adjustments during pregnancy",
                    "Therapeutic drug monitoring recommended",
                    "Considered safe for breastfeeding"
                ],
                "monitoring": [
                    "Regular blood level monitoring",
                    "Folic acid supplementation (5mg daily)",
                    "Detailed anomaly scan at 18-20 weeks"
                ]
            },
            {
                "medication": "Levetiracetam",
                "brand_names": ["Keppra"],
                "pregnancy_category": "Category C",
                "safety_profile": "Generally considered safer during pregnancy",
                "key_points": [
                    "Lower risk of major congenital malformations",
                    "Good seizure control during pregnancy",
                    "May require dose adjustments",
                    "Considered safe for breastfeeding"
                ],
                "monitoring": [
                    "Regular blood level monitoring",
                    "Folic acid supplementation (5mg daily)",
                    "Detailed anomaly scan at 18-20 weeks"
                ]
            },
            {
                "medication": "Valproic Acid",
                "brand_names": ["Depakote", "Depakene"],
                "pregnancy_category": "Category D",
                "safety_profile": "Higher risk during pregnancy",
                "key_points": [
                    "Highest risk of major congenital malformations (10-11%)",
                    "Increased risk of neurodevelopmental problems",
                    "Should be avoided if possible during pregnancy",
                    "If necessary, use lowest effective dose"
                ],
                "monitoring": [
                    "High-dose folic acid supplementation (5mg daily)",
                    "Detailed anomaly scan at 18-20 weeks",
                    "Consider alternative medications if possible",
                    "Close monitoring for birth defects"
                ]
            },
            {
                "medication": "Carbamazepine",
                "brand_names": ["Tegretol"],
                "pregnancy_category": "Category D",
                "safety_profile": "Moderate risk during pregnancy",
                "key_points": [
                    "Risk of neural tube defects",
                    "May cause vitamin K deficiency in newborn",
                    "Requires folic acid supplementation",
                    "Consider vitamin K supplementation in last month"
                ],
                "monitoring": [
                    "Folic acid supplementation (5mg daily)",
                    "Detailed anomaly scan at 18-20 weeks",
                    "Vitamin K supplementation in last month",
                    "Monitor for neural tube defects"
                ]
            },
            {
                "medication": "Phenytoin",
                "brand_names": ["Dilantin"],
                "pregnancy_category": "Category D",
                "safety_profile": "Moderate risk during pregnancy",
                "key_points": [
                    "Risk of fetal hydantoin syndrome",
                    "May cause vitamin K deficiency",
                    "Requires careful monitoring",
                    "Consider alternative medications"
                ],
                "monitoring": [
                    "Folic acid supplementation (5mg daily)",
                    "Detailed anomaly scan at 18-20 weeks",
                    "Vitamin K supplementation in last month",
                    "Monitor for fetal hydantoin syndrome"
                ]
            }
        ],
        "general_guidelines": [
            "Pre-pregnancy counseling is essential",
            "Folic acid supplementation (5mg daily) before conception",
            "Regular monitoring of medication levels",
            "Multidisciplinary team approach",
            "Consider medication changes before pregnancy if possible"
        ]
    }
    
    return epilepsy_meds_safety

if __name__ == "__main__":
    print("🌍 Starting DailyMed and epilepsy medication safety extraction...")
    
    # Try to fetch from DailyMed API
    try:
        dailymed_data = fetch_dailymed_data()
        if dailymed_data["medications"]:
            with open("../dailymed_medication_data.json", "w", encoding="utf-8") as f:
                json.dump(dailymed_data, f, indent=2, ensure_ascii=False)
            print(f"✅ DailyMed data saved to dailymed_medication_data.json")
        else:
            print("⚠️ No DailyMed data retrieved, creating comprehensive database instead")
    except Exception as e:
        print(f"⚠️ DailyMed API access failed: {e}")
        print("Creating comprehensive epilepsy medication safety database instead")
    
    # Create comprehensive epilepsy medication safety database
    epilepsy_safety_data = create_epilepsy_medication_safety_database()
    
    with open("../epilepsy_medication_safety_database.json", "w", encoding="utf-8") as f:
        json.dump(epilepsy_safety_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Epilepsy medication safety database created!")
    print(f"📈 Successfully created database with {len(epilepsy_safety_data['medications'])} medications")
    print(f"💾 Epilepsy medication safety database saved to epilepsy_medication_safety_database.json")
    
    # Show sample content
    print(f"\n🔍 Sample epilepsy medication safety content:")
    for i, med in enumerate(epilepsy_safety_data["medications"][:2]):
        print(f"{i+1}. {med['medication']} ({med['brand_names'][0]})")
        print(f"   Category: {med['pregnancy_category']}")
        print(f"   Safety: {med['safety_profile']}")
        print(f"   Key Points: {med['key_points'][0]}")
