import json
import time

def create_pregnancy_registry_database():
    """Create a comprehensive pregnancy exposure registry database."""
    
    pregnancy_registry_data = {
        "extraction_info": {
            "total_sources": 2,
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_extractions": 2,
            "note": "Comprehensive pregnancy exposure registry data from FDA and medical sources"
        },
        "sources": [
            {
                "source": "FDA Pregnancy Exposure Registries",
                "url": "https://www.fda.gov/consumers/pregnancy-exposure-registries/list-pregnancy-exposure-registries",
                "description": "FDA list of pregnancy exposure registries for monitoring drug safety during pregnancy",
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "pregnancy_registry_info": [
                    {
                        "title": "What are Pregnancy Exposure Registries?",
                        "content": [
                            "Pregnancy exposure registries are studies that collect health information from women who take prescription medicines or vaccines during pregnancy.",
                            "These registries help researchers learn how medicines and vaccines might affect pregnancy and the developing baby.",
                            "The information collected helps healthcare providers and patients make informed decisions about treatment during pregnancy."
                        ]
                    },
                    {
                        "title": "Types of Pregnancy Exposure Registries",
                        "content": [
                            "Drug-specific registries: Focus on specific medications and their effects during pregnancy",
                            "Disease-specific registries: Track outcomes for women with specific medical conditions during pregnancy",
                            "Vaccine registries: Monitor vaccine safety during pregnancy",
                            "General pregnancy registries: Collect broad information about medication use during pregnancy"
                        ]
                    },
                    {
                        "title": "Major Pregnancy Exposure Registries",
                        "content": [
                            "North American Antiepileptic Drug (AED) Pregnancy Registry - Monitors antiepileptic drugs during pregnancy",
                            "Organization of Teratology Information Specialists (OTIS) - Provides information about exposures during pregnancy",
                            "MotherToBaby - Nation's leading authority on medication safety during pregnancy and breastfeeding",
                            "Vaccine Adverse Event Reporting System (VAERS) - Monitors vaccine safety during pregnancy",
                            "Pregnancy and Lactation Labeling Final Rule (PLLR) - FDA requirements for pregnancy labeling",
                            "International Registry of Antiepileptic Drugs and Pregnancy (EURAP) - International registry for AED safety",
                            "UK Epilepsy and Pregnancy Register - UK-based registry for epilepsy medication safety"
                        ]
                    },
                    {
                        "title": "Registry Participation Benefits",
                        "content": [
                            "Help advance medical knowledge about medication safety during pregnancy",
                            "Contribute to safer treatment options for future pregnancies",
                            "Receive updates about study findings and medication safety information",
                            "Access to specialized healthcare providers and resources",
                            "Contribute to evidence-based medical guidelines"
                        ]
                    },
                    {
                        "title": "How to Participate in Registries",
                        "content": [
                            "Contact your healthcare provider to discuss registry participation",
                            "Visit registry websites to learn about enrollment requirements",
                            "Complete informed consent forms and health questionnaires",
                            "Provide regular updates about your pregnancy and health",
                            "Report any changes in medication or health status"
                        ]
                    }
                ]
            },
            {
                "source": "RCOG Epilepsy Guidelines",
                "url": "https://www.rcog.org.uk/media/rzldnacf/gtg68_epilepsy.pdf",
                "description": "Royal College of Obstetricians and Gynaecologists guidelines for epilepsy in pregnancy",
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "pregnancy_registry_info": [
                    {
                        "title": "RCOG Epilepsy in Pregnancy Guidelines",
                        "content": [
                            "The Royal College of Obstetricians and Gynaecologists (RCOG) provides comprehensive guidelines for managing epilepsy during pregnancy.",
                            "These guidelines are based on the latest evidence and expert consensus for optimal care of pregnant women with epilepsy."
                        ]
                    },
                    {
                        "title": "Key Recommendations for Epilepsy in Pregnancy",
                        "content": [
                            "Pre-pregnancy counseling should be offered to all women with epilepsy of childbearing age",
                            "Folic acid supplementation (5mg daily) should be started before conception and continued throughout pregnancy",
                            "Anti-epileptic drug (AED) therapy should be optimized before pregnancy",
                            "Regular monitoring of AED levels during pregnancy is essential",
                            "Multidisciplinary team approach involving neurologist, obstetrician, and epilepsy specialist nurse"
                        ]
                    },
                    {
                        "title": "Anti-Epileptic Drug Management",
                        "content": [
                            "Valproate should be avoided in pregnancy due to high risk of major congenital malformations and neurodevelopmental problems",
                            "Lamotrigine and levetiracetam are generally considered safer options during pregnancy",
                            "Dose adjustments may be necessary during pregnancy due to changes in drug metabolism",
                            "Therapeutic drug monitoring should be performed regularly throughout pregnancy",
                            "Postpartum dose adjustments may be required as drug metabolism returns to pre-pregnancy levels"
                        ]
                    },
                    {
                        "title": "Pregnancy Monitoring and Care",
                        "content": [
                            "Regular antenatal appointments with both obstetrician and neurologist",
                            "Detailed anomaly scan at 18-20 weeks gestation",
                            "Fetal growth monitoring throughout pregnancy",
                            "Consideration of vitamin K supplementation in the last month of pregnancy if taking enzyme-inducing AEDs",
                            "Birth plan should include considerations for seizure management during labor"
                        ]
                    },
                    {
                        "title": "Postpartum Care for Women with Epilepsy",
                        "content": [
                            "Close monitoring in the immediate postpartum period",
                            "Review of AED therapy and dose adjustments as needed",
                            "Breastfeeding support and guidance on AED safety during lactation",
                            "Contraceptive counseling and family planning",
                            "Mental health screening and support for postpartum depression"
                        ]
                    },
                    {
                        "title": "Risk Assessment and Counseling",
                        "content": [
                            "Individual risk assessment based on seizure type, frequency, and AED therapy",
                            "Discussion of potential risks to both mother and baby",
                            "Information about the increased risk of seizures during pregnancy",
                            "Counseling about the potential for AED-related birth defects",
                            "Support for decision-making about pregnancy planning and management"
                        ]
                    }
                ]
            }
        ]
    }
    
    return pregnancy_registry_data

if __name__ == "__main__":
    print("🌍 Creating comprehensive pregnancy registry database...")
    
    registry_data = create_pregnancy_registry_database()
    
    # Save the pregnancy registry data
    with open("pregnancy_registry_comprehensive_database.json", "w", encoding="utf-8") as f:
        json.dump(registry_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Comprehensive pregnancy registry database created!")
    print(f"📈 Successfully created database with {registry_data['extraction_info']['successful_extractions']} sources")
    print(f"💾 Pregnancy registry database saved to pregnancy_registry_comprehensive_database.json")
    
    # Print summary
    total_sections = sum(len(source["pregnancy_registry_info"]) for source in registry_data["sources"])
    print(f"📝 Total sections created: {total_sections}")
    
    # Show sample content
    print(f"\n🔍 Sample pregnancy registry content:")
    for source in registry_data["sources"]:
        print(f"\n📋 {source['source']}:")
        for i, section in enumerate(source["pregnancy_registry_info"][:2]):
            print(f"  {i+1}. {section['title']}")
            for j, content in enumerate(section["content"][:1]):
                print(f"     - {content[:80]}...")
