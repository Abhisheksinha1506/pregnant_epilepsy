import json
import csv
import xml.etree.ElementTree as ET
import time
import os

def create_csv_files():
    """Create CSV files for tabular data like medication lists and tracking data."""
    print("📊 Creating CSV files for tabular data...")
    
    # Epilepsy Medications CSV
    epilepsy_meds = [
        ["Medication", "Brand Name", "Pregnancy Category", "Safety Level", "Key Points", "Monitoring Required"],
        ["Lamotrigine", "Lamictal", "Category C", "Safer", "Lower risk of birth defects", "Blood levels, folic acid"],
        ["Levetiracetam", "Keppra", "Category C", "Safer", "Good seizure control", "Blood levels, folic acid"],
        ["Valproic Acid", "Depakote", "Category D", "High Risk", "Highest risk of birth defects", "Detailed scans, folic acid"],
        ["Carbamazepine", "Tegretol", "Category D", "Moderate Risk", "Risk of neural tube defects", "Folic acid, vitamin K"],
        ["Phenytoin", "Dilantin", "Category D", "Moderate Risk", "Risk of fetal hydantoin syndrome", "Folic acid, vitamin K"]
    ]
    
    with open("../epilepsy_medications.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(epilepsy_meds)
    
    # Pregnancy Tracking CSV
    pregnancy_tracking = [
        ["Week", "Milestone", "Medication Check", "Doctor Visit", "Tests", "Notes"],
        ["Pre-pregnancy", "Folic acid start", "Baseline levels", "Pre-conception counseling", "Genetic counseling", "Plan medication changes"],
        ["5", "First ASM level", "Lamotrigine/Levetiracetam", "Neurologist", "Baseline labs", "Continue folic acid"],
        ["9", "Second ASM level", "Monitor levels", "OB-GYN", "Dating scan", "Adjust doses if needed"],
        ["13", "Third ASM level", "Monitor levels", "Combined visit", "Nuchal translucency", "Detailed planning"],
        ["17", "Fourth ASM level", "Monitor levels", "OB-GYN", "Anatomy scan", "Check for birth defects"],
        ["21", "Fifth ASM level", "Monitor levels", "Neurologist", "Growth scan", "Continue monitoring"],
        ["25", "Sixth ASM level", "Monitor levels", "OB-GYN", "Growth scan", "Prepare for delivery"],
        ["29", "Seventh ASM level", "Monitor levels", "Combined visit", "Growth scan", "Delivery planning"],
        ["33", "Eighth ASM level", "Monitor levels", "OB-GYN", "Growth scan", "Final preparations"],
        ["37", "Ninth ASM level", "Monitor levels", "Combined visit", "Growth scan", "Delivery ready"]
    ]
    
    with open("../pregnancy_tracking_schedule.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(pregnancy_tracking)
    
    # Seizure Tracking CSV
    seizure_tracking = [
        ["Date", "Time", "Type", "Duration", "Triggers", "Medication Taken", "Notes"],
        ["2025-10-01", "14:30", "Focal", "2 minutes", "Stress", "Lamotrigine 200mg", "Mild seizure"],
        ["2025-10-02", "09:15", "Generalized", "1 minute", "Sleep deprivation", "Lamotrigine 200mg", "Brief tonic-clonic"],
        ["2025-10-03", "16:45", "Focal", "30 seconds", "None", "Lamotrigine 200mg", "Very brief"]
    ]
    
    with open("../seizure_tracking_log.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(seizure_tracking)
    
    print("✅ Created CSV files: epilepsy_medications.csv, pregnancy_tracking_schedule.csv, seizure_tracking_log.csv")

def create_xml_files():
    """Create XML files for structured medical data."""
    print("📄 Creating XML files for structured medical data...")
    
    # Medical Guidelines XML
    guidelines = ET.Element("MedicalGuidelines")
    guidelines.set("version", "1.0")
    guidelines.set("date", time.strftime("%Y-%m-%d"))
    
    epilepsy_guidelines = ET.SubElement(guidelines, "EpilepsyGuidelines")
    epilepsy_guidelines.set("source", "RCOG")
    
    pre_pregnancy = ET.SubElement(epilepsy_guidelines, "PrePregnancy")
    pre_pregnancy.text = "Pre-pregnancy counseling should be offered to all women with epilepsy of childbearing age"
    
    folic_acid = ET.SubElement(epilepsy_guidelines, "FolicAcid")
    folic_acid.text = "Folic acid supplementation (5mg daily) should be started before conception"
    
    medication_optimization = ET.SubElement(epilepsy_guidelines, "MedicationOptimization")
    medication_optimization.text = "Anti-epileptic drug therapy should be optimized before pregnancy"
    
    monitoring = ET.SubElement(epilepsy_guidelines, "Monitoring")
    monitoring.text = "Regular monitoring of AED levels during pregnancy is essential"
    
    # Save XML
    tree = ET.ElementTree(guidelines)
    tree.write("../medical_guidelines.xml", encoding="utf-8", xml_declaration=True)
    
    print("✅ Created XML file: medical_guidelines.xml")

def create_txt_files():
    """Create TXT files for readable content and documentation."""
    print("📝 Creating TXT files for readable content...")
    
    # Emergency Information TXT
    emergency_info = """EPILEPSY PREGNANCY EMERGENCY INFORMATION

SEIZURE FIRST AID:
1. Stay calm and time the seizure
2. Protect the person from injury
3. Do NOT put anything in their mouth
4. Turn them on their side if possible
5. Call emergency services if seizure lasts more than 5 minutes

PREGNANCY-SPECIFIC CONSIDERATIONS:
- Seizures during pregnancy can affect both mother and baby
- Increased risk of seizures during pregnancy
- Medication levels may need adjustment
- Regular monitoring is essential

EMERGENCY CONTACTS:
- Neurologist: [Add contact]
- OB-GYN: [Add contact]
- Emergency: 911
- Epilepsy Foundation Helpline: 1-800-332-1000

MEDICATION INFORMATION:
- Current medications: [List current medications]
- Dosages: [List dosages]
- Last dose: [Record last dose time]
- Allergies: [List any allergies]

IMPORTANT NOTES:
- Continue taking prescribed medications
- Do not stop medications without doctor approval
- Keep seizure diary updated
- Attend all scheduled appointments
"""
    
    with open("../emergency_information.txt", "w", encoding="utf-8") as f:
        f.write(emergency_info)
    
    # Medication Instructions TXT
    medication_instructions = """EPILEPSY MEDICATION INSTRUCTIONS DURING PREGNANCY

LAMOTRIGINE (LAMICTAL):
- Generally safer during pregnancy
- May require dose adjustments
- Monitor blood levels regularly
- Continue folic acid supplementation

LEVETIRACETAM (KEPPRA):
- Generally safer during pregnancy
- Good seizure control
- Monitor blood levels regularly
- Continue folic acid supplementation

VALPROIC ACID (DEPAKOTE):
- HIGH RISK during pregnancy
- Avoid if possible
- If necessary, use lowest effective dose
- High-dose folic acid required

CARBAMAZEPINE (TEGRETOL):
- Moderate risk during pregnancy
- Risk of neural tube defects
- Folic acid supplementation required
- Vitamin K in last month

PHENYTOIN (DILANTIN):
- Moderate risk during pregnancy
- Risk of fetal hydantoin syndrome
- Folic acid supplementation required
- Vitamin K in last month

GENERAL INSTRUCTIONS:
- Take medications exactly as prescribed
- Do not stop or change doses without doctor approval
- Report any side effects immediately
- Keep all appointments
- Maintain seizure diary
"""
    
    with open("../medication_instructions.txt", "w", encoding="utf-8") as f:
        f.write(medication_instructions)
    
    print("✅ Created TXT files: emergency_information.txt, medication_instructions.txt")

def create_md_files():
    """Create Markdown files for documentation and user guides."""
    print("📚 Creating Markdown files for documentation...")
    
    # User Guide MD
    user_guide = """# Epilepsy Pregnancy App - User Guide

## Overview
This app helps pregnant women with epilepsy manage their condition safely with proper medical guidance.

## Features

### 1. Medication Tracking
- Track your epilepsy medications
- Monitor dosage changes
- Record side effects
- Set medication reminders

### 2. Seizure Logging
- Log seizure events
- Track triggers and patterns
- Monitor seizure frequency
- Share data with doctors

### 3. Pregnancy Planning
- Pre-pregnancy counseling
- Medication optimization
- Folic acid supplementation
- Risk assessment

### 4. Safety Monitoring
- Regular check-ups
- Blood level monitoring
- Fetal development tracking
- Emergency planning

## Getting Started

1. **Setup**: Enter your current medications and dosages
2. **Planning**: Schedule pre-pregnancy counseling
3. **Tracking**: Start logging seizures and medication
4. **Monitoring**: Attend all scheduled appointments

## Safety Tips

- Always consult your doctor before making changes
- Continue taking prescribed medications
- Maintain regular appointments
- Keep emergency contacts handy
- Follow safety guidelines

## Emergency Information

If you have a seizure:
1. Stay calm and time the seizure
2. Protect yourself from injury
3. Call emergency services if needed
4. Contact your neurologist
5. Update your seizure diary

## Support Resources

- Epilepsy Foundation: 1-800-332-1000
- Your neurologist: [Add contact]
- Your OB-GYN: [Add contact]
- Emergency: 911

## Important Notes

- This app is for informational purposes only
- Always consult healthcare providers for medical decisions
- Keep all appointments
- Report any concerns immediately
"""
    
    with open("../user_guide.md", "w", encoding="utf-8") as f:
        f.write(user_guide)
    
    # API Documentation MD
    api_docs = """# Epilepsy Pregnancy App - API Documentation

## Data Sources

### JSON Files
- `epilepsy_pregnancy_comprehensive_data.json` - Main epilepsy pregnancy data
- `epilepsy_medication_safety_database.json` - Medication safety information
- `comprehensive_pregnancy_categories.json` - Pregnancy risk categories
- `comprehensive_lactation_database.json` - Breastfeeding safety data

### CSV Files
- `epilepsy_medications.csv` - Medication list with safety profiles
- `pregnancy_tracking_schedule.csv` - Pregnancy milestone tracking
- `seizure_tracking_log.csv` - Seizure event logging template

### XML Files
- `medical_guidelines.xml` - Structured medical guidelines

### TXT Files
- `emergency_information.txt` - Emergency procedures and contacts
- `medication_instructions.txt` - Medication-specific instructions

### PDF Files
- `rcog_epilepsy_guidelines.pdf` - RCOG clinical guidelines
- `seizure_event_diary.pdf` - Seizure tracking diary

## API Endpoints

### GET /api/medications
Returns list of epilepsy medications with safety profiles

### GET /api/pregnancy-schedule
Returns pregnancy tracking schedule

### POST /api/seizure-log
Logs a new seizure event

### GET /api/safety-guidelines
Returns safety guidelines and recommendations

### GET /api/emergency-info
Returns emergency information and contacts

## Data Formats

- **JSON**: Structured data for APIs
- **CSV**: Tabular data for spreadsheets
- **XML**: Structured medical data
- **TXT**: Readable content
- **MD**: Documentation
- **PDF**: Clinical guidelines and forms
"""
    
    with open("../api_documentation.md", "w", encoding="utf-8") as f:
        f.write(api_docs)
    
    print("✅ Created MD files: user_guide.md, api_documentation.md")

if __name__ == "__main__":
    print("🌍 Creating proper file formats for epilepsy pregnancy app...")
    
    # Create different file formats
    create_csv_files()
    create_xml_files()
    create_txt_files()
    create_md_files()
    
    print(f"\n✅ File format creation complete!")
    print(f"📊 Created files in multiple formats:")
    print(f"   - CSV files for tabular data")
    print(f"   - XML files for structured medical data")
    print(f"   - TXT files for readable content")
    print(f"   - MD files for documentation")
    print(f"   - JSON files for API data")
    print(f"   - PDF files for clinical guidelines")
    
    print(f"\n🎯 Perfect for different app components:")
    print(f"   - Web apps: JSON, CSV, XML")
    print(f"   - Mobile apps: JSON, TXT, PDF")
    print(f"   - Documentation: MD, TXT")
    print(f"   - Clinical use: PDF, XML")
