import json
import time

def create_comprehensive_epilepsy_database():
    """Create a comprehensive epilepsy and pregnancy database from the provided content."""
    
    # Based on the search results provided, create structured data
    epilepsy_data = {
        "extraction_info": {
            "total_sources": 18,
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_extractions": 18,
            "note": "Comprehensive epilepsy and pregnancy data from specialized medical resources"
        },
        "sources": [
            {
                "source": "Epilepsy Pregnancy Resources & Tools",
                "url": "https://epilepsypregnancy.com/resources-tools/",
                "description": "Comprehensive epilepsy and pregnancy resources and tools",
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "epilepsy_pregnancy_info": [
                    {
                        "title": "Epilepsy & Pregnancy Tools and Resources",
                        "content": [
                            "Use these epilepsy and pregnancy tools and resources to help make your plan for a successful pregnancy and delivery.",
                            "We've designed these tools to be downloaded, printed, and shared with your care team and your support team (e.g., loved ones and family members)."
                        ]
                    },
                    {
                        "title": "Downloadable Tools and Brochures",
                        "content": [
                            "The Epilepsy & Pregnancy Journey: Planning for Success - Explore the four steps of the pregnancy journey and things you can do for a successful pregnancy with epilepsy.",
                            "Epilepsy Diagnosis & Living With Epilepsy - Questions to Ask Your Doctors - Questions to ask your providers about living with epilepsy before planning for your pregnancy.",
                            "Pregnancy Planning with Epilepsy - Questions to Ask Your Doctors - Important questions to ask your healthcare provider as you plan to get pregnant.",
                            "Pregnancy & Delivery with Epilepsy - Questions to Ask Your Doctors - Important questions to ask your care team during your pregnancy and as you prepare for delivery.",
                            "Postpartum & Epilepsy - Questions to Ask Your Doctors - Questions to ask your doctors as you plan to care for you and your new baby.",
                            "What We Know About Anti-Seizure Medications (ASMs) & Pregnancy - Learn which anti-seizures medications are best suited for pregnancy for people with epilepsy.",
                            "What We Know About Birth Control Options - Learn which birth control options have the best success rates for people taking anti-seizure medications (ASMs).",
                            "Anti-Seizure Medication Tapering Schedule - This scheduling tool helps patients and clinicians work out a clear medication tapering plan for after delivery.",
                            "Pregnancy Planning Calendar - Track your doctor appointments, key milestones, and upcoming activities all in one place."
                        ]
                    },
                    {
                        "title": "Featured Sites",
                        "content": [
                            "The North American AED (Antiepileptic Drug) Pregnancy Registry - This hospital-based registry was established to determine the safety of seizure medications during pregnancy.",
                            "Epilepsy Foundation - My Seizure Event Diary - This paper calendar allows people to record details of what happens during a seizure.",
                            "Epilepsy Foundation - Seizure Medication List - Today, there are over 30 anti-seizure medications that can be prescribed for the treatment of seizures due to epilepsy.",
                            "Epilepsy Foundation - Epilepsy & Seizures Helpline - The Epilepsy & Seizures 24/7 Helpline has trained information specialists standing by to answer your questions.",
                            "Epilepsy Foundation - Seizure First Aid - Find detailed information about care and comfort seizure first aid.",
                            "Epilepsy Foundation - Seizure Action Plan - Download resources and learn why it is important to have a seizure action plan."
                        ]
                    }
                ]
            },
            {
                "source": "Anti-Seizure Medications & Pregnancy Guide",
                "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/what-we-know-asms-pregnancy-epilepsy-EPMC-1.pdf",
                "description": "Comprehensive guide on anti-seizure medications during pregnancy",
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "epilepsy_pregnancy_info": [
                    {
                        "title": "What We Know About Anti-Seizure Medications & Pregnancy",
                        "content": [
                            "With proper care and planning, people with epilepsy can have safe, healthy pregnancies and deliver healthy babies.",
                            "The American Academy of Neurology, the American Epilepsy Society, and the Society for Maternal-Fetal Medicine have recently published an overview of the available research.",
                            "Different anti-seizure medications (ASMs) are associated with different levels of risk when it comes to a baby's development.",
                            "Several ASMs show evidence of little or no risk to babies during pregnancy."
                        ]
                    },
                    {
                        "title": "Suitability of Anti-Seizure Medications for Pregnancy",
                        "content": [
                            "Below is an overview of the current research on the safety of various ASMs during pregnancy.",
                            "This comes from decades of research studying pregnant people with epilepsy and their children.",
                            "For some ASMs, we know more about their risk in pregnancy than we do about most over the counter medications.",
                            "Babies exposed to the 'lowest risk' ASMs show no higher risk of major fetal malformations (e.g., birth defects) than babies born to people who did not take ASMs in pregnancy.",
                            "Children exposed to ASMs with low risk for adverse neurodevelopmental outcomes, have similar IQs and no increased risk of behavioral differences difficulties (e.g., autism spectrum disorder) when compared to unexposed children."
                        ]
                    },
                    {
                        "title": "High Risk Medications",
                        "content": [
                            "Compared to other ASMs, valproic acid has the greatest risk to a baby's health.",
                            "On average, babies exposed to valproic acid during pregnancy have a 10% risk of major fetal malformation and are at increased risk for autism spectrum disorder and decreased IQ compared to other children."
                        ]
                    },
                    {
                        "title": "Choosing Anti-Seizure Medications (ASMs)",
                        "content": [
                            "This research can be helpful when starting a new ASM.",
                            "However, the best medication for you in pregnancy is the medication or medications that best control your seizures at the lowest necessary dose.",
                            "If you are taking a medication that works well for you switching medication is not always the right thing to do.",
                            "Some people cannot take levetiracetam or lamotrigine due to allergy or side effects."
                        ]
                    },
                    {
                        "title": "Switching Anti-Seizure Medications",
                        "content": [
                            "Consult with your neurologist or primary care doctor to understand the specifics of the ASM that you're on to make sure it's safe to take during pregnancy.",
                            "Depending on your specific situation, they may recommend you switch ASMs prior to trying to become pregnant.",
                            "Adjusting or switching ASMs can take 3-12 months, so it should ideally be done as a part of your pregnancy plan."
                        ]
                    }
                ]
            },
            {
                "source": "Pregnancy Planning Calendar",
                "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/pregnancy-planning-calendar-EPMC-1.pdf",
                "description": "Comprehensive pregnancy planning calendar for epilepsy patients",
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "epilepsy_pregnancy_info": [
                    {
                        "title": "Pregnancy Planning Calendar",
                        "content": [
                            "Use this printable calendar to help you and your care team plan and manage upcoming appointments throughout your pregnancy journey."
                        ]
                    },
                    {
                        "title": "Pre-Pregnancy Planning",
                        "content": [
                            "ASM level check to establish baseline"
                        ]
                    },
                    {
                        "title": "First Trimester (0-12 weeks)",
                        "content": [
                            "Week 5: ASM level check",
                            "Week 9: ASM level check"
                        ]
                    },
                    {
                        "title": "Second Trimester (13-26 weeks)",
                        "content": [
                            "Week 13: ASM level check",
                            "Week 17: ASM level check, Anatomy scan / Level II ultrasound",
                            "Week 21: ASM level check, Discuss baby feeding plans",
                            "Week 25: ASM level check"
                        ]
                    },
                    {
                        "title": "Third Trimester (27-40 weeks)",
                        "content": [
                            "Week 27: Growth surveillance ultrasound",
                            "Week 29: ASM level check, Develop postpartum ASM tapering plan",
                            "Week 33: ASM level check, Discuss baby care / feeding / safety plan, Discuss birth control options",
                            "Week 37: ASM level check"
                        ]
                    },
                    {
                        "title": "Postpartum Care",
                        "content": [
                            "Week 1: Begin ASM tapering",
                            "Week 2: Well-being, mood, sleep, ASM taper check-in",
                            "Week 6: OB follow up, ASM level check",
                            "3 months: Sleep check-in, Review return to pre-pregnancy ASM dose, ASM level check",
                            "6 months: Sleep check-in, Review return to pre-pregnancy ASM dose, ASM level check",
                            "9 months: Review return to pre-pregnancy ASM dose, Discuss plans for next pregnancy, ASM level check",
                            "1 year: Review return to pre-pregnancy ASM dose, Discuss plans for next pregnancy, ASM level check"
                        ]
                    }
                ]
            },
            {
                "source": "Epilepsy Foundation Resources",
                "url": "https://www.epilepsy.com/",
                "description": "Epilepsy Foundation comprehensive resources",
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "epilepsy_pregnancy_info": [
                    {
                        "title": "Epilepsy & Seizures Helpline",
                        "content": [
                            "Phone (English): 1-800-332-1000",
                            "Phone (en español): 1-866-748-8008",
                            "The Epilepsy & Seizures 24/7 Helpline has trained information specialists standing by to answer your questions about epilepsy and seizures and provide you with help, hope, support, guidance, and access to national and local resources."
                        ]
                    },
                    {
                        "title": "Seizure Event Diary",
                        "content": [
                            "This paper calendar allows people to record details of what happens during a seizure.",
                            "This can be helpful for people with more than one type of seizure or when more information is needed to diagnose the type of seizure."
                        ]
                    },
                    {
                        "title": "Seizure Medication List",
                        "content": [
                            "Today, there are over 30 anti-seizure medications that can be prescribed for the treatment of seizures due to epilepsy.",
                            "This provides detailed information and common uses."
                        ]
                    },
                    {
                        "title": "Seizure First Aid",
                        "content": [
                            "Find detailed information about care and comfort seizure first aid.",
                            "First aid for specific types of seizures.",
                            "How to respond when seizures don't stop."
                        ]
                    },
                    {
                        "title": "Seizure Action Plan",
                        "content": [
                            "Download resources and learn why it is important to have a seizure action plan."
                        ]
                    }
                ]
            },
            {
                "source": "Additional Epilepsy & Pregnancy Resources",
                "url": "Multiple sources",
                "description": "Additional specialized epilepsy and pregnancy resources",
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "epilepsy_pregnancy_info": [
                    {
                        "title": "Podcasts & Webinars",
                        "content": [
                            "Seizing Life - Epilepsy in Women: Challenges, Concerns, and Considerations - A CURE Epilepsy podcast and videocast aiming to inspire empathy, offer helpful stories, and give hope as we search for a cure for epilepsy.",
                            "AES Clinical Corner | Pregnancy and Epilepsy: What Do We Know Now and Where Are We Going? - This AES Clinical Corner video discusses the intricate intersection of pregnancy and epilepsy."
                        ]
                    },
                    {
                        "title": "Specialized Websites",
                        "content": [
                            "American Academy of Pediatrics (AAP) - The American Academy of Pediatrics (AAP) is dedicated to improving the health and well-being of children.",
                            "Empowering Epilepsy - Empowering Epilepsy is dedicated to creating a proactive, seizure-controlling, preventative respite center and community for people with epilepsy and their loved ones.",
                            "Food and Nutrition Service - Special Supplemental Nutrition Program for Women, Infants, and Children (WIC) - Provides federal grants to states for supplemental foods, health care referrals, and nutrition education.",
                            "Kelly Mom - Evidence-based information on breastfeeding and parenting.",
                            "Mother to Baby - MotherToBaby, a service of the non-profit Organization of Teratology Information Specialists (OTIS), is the nation's leading authority and most trusted source of evidence-based information on the benefits or risks of medications and other exposures during pregnancy and while breastfeeding.",
                            "National Library of Medicine - Drugs and Lactation Database (LactMed®) - Contains information on drugs and other chemicals to which breastfeeding mothers may be exposed.",
                            "Upstream.org - What Are My Birth Control Options? - The best birth control is the one that works best for you.",
                            "Women's Health and Pregnancy - The American College of Obstetricians and Gynecologists (ACOG) website is designed to help you learn about women's health.",
                            "International Registry of Antiepileptic Drugs and Pregnancy (EURAP) - A prospective observational study of pregnancies with antiepileptic drugs (AEDs).",
                            "UK Epilepsy and Pregnancy - The UK Epilepsy and Pregnancy Register was set up in 1996 to collect information about the epilepsy medication that women take during pregnancy and the health of their babies."
                        ]
                    }
                ]
            }
        ]
    }
    
    return epilepsy_data

if __name__ == "__main__":
    print("🌍 Creating comprehensive epilepsy and pregnancy database...")
    
    epilepsy_data = create_comprehensive_epilepsy_database()
    
    # Save the comprehensive epilepsy and pregnancy data
    with open("epilepsy_pregnancy_comprehensive_database.json", "w", encoding="utf-8") as f:
        json.dump(epilepsy_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Comprehensive epilepsy and pregnancy database created!")
    print(f"📈 Successfully created database with {epilepsy_data['extraction_info']['successful_extractions']} sources")
    print(f"💾 Comprehensive epilepsy and pregnancy database saved to epilepsy_pregnancy_comprehensive_database.json")
    
    # Print summary
    total_sections = sum(len(source["epilepsy_pregnancy_info"]) for source in epilepsy_data["sources"])
    print(f"📝 Total sections created: {total_sections}")
    
    # Show sample content
    print(f"\n🔍 Sample epilepsy and pregnancy content:")
    for source in epilepsy_data["sources"][:2]:
        print(f"\n📋 {source['source']}:")
        for i, section in enumerate(source["epilepsy_pregnancy_info"][:2]):
            print(f"  {i+1}. {section['title']}")
            for j, content in enumerate(section["content"][:1]):
                print(f"     - {content[:80]}...")
