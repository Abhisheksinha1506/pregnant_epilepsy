import requests
import json
import time
import os
from urllib.parse import urlparse

# PDF resources that need proper handling
PDF_RESOURCES = [
    {
        "name": "RCOG Epilepsy Guidelines",
        "url": "https://www.rcog.org.uk/media/rzldnacf/gtg68_epilepsy.pdf",
        "description": "Royal College of Obstetricians and Gynaecologists guidelines for epilepsy in pregnancy",
        "filename": "rcog_epilepsy_guidelines.pdf"
    },
    {
        "name": "Epilepsy Pregnancy Delivery Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-pregnancy-delivery-doctors-questions-EPMC.pdf",
        "description": "Questions to ask doctors during pregnancy and delivery with epilepsy",
        "filename": "epilepsy_pregnancy_delivery_questions.pdf"
    },
    {
        "name": "Epilepsy Postpartum Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-postpartum-pregnancy-doctors-questions-EPMC.pdf",
        "description": "Questions to ask doctors during postpartum period with epilepsy",
        "filename": "epilepsy_postpartum_questions.pdf"
    },
    {
        "name": "Anti-Seizure Medications Pregnancy Guide",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/what-we-know-asms-pregnancy-epilepsy-EPMC-1.pdf",
        "description": "Comprehensive guide on anti-seizure medications during pregnancy",
        "filename": "anti_seizure_medications_pregnancy_guide.pdf"
    },
    {
        "name": "Pregnancy Planning Calendar",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/pregnancy-planning-calendar-EPMC-1.pdf",
        "description": "Pregnancy planning calendar for epilepsy patients",
        "filename": "pregnancy_planning_calendar.pdf"
    },
    {
        "name": "Anti-Seizure Medication Tapering Schedule",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/anti-seizure-medications-pregnancy-tapering-schedule-EPMC-1.pdf",
        "description": "Medication tapering schedule for after delivery",
        "filename": "anti_seizure_medication_tapering_schedule.pdf"
    },
    {
        "name": "Birth Control Options for Epilepsy",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/what-we-know-birth-control-pregnancy-epilepsy-EPMC.pdf",
        "description": "Birth control options for people with epilepsy",
        "filename": "birth_control_options_epilepsy.pdf"
    },
    {
        "name": "Epilepsy Pregnancy Journey Planning",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-pregnancy-journey-planning.pdf",
        "description": "Epilepsy pregnancy journey planning guide",
        "filename": "epilepsy_pregnancy_journey_planning.pdf"
    },
    {
        "name": "Epilepsy Diagnosis Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-diagnosis-pregnancy-doctors-questions-EPMC.pdf",
        "description": "Questions to ask doctors about epilepsy diagnosis",
        "filename": "epilepsy_diagnosis_questions.pdf"
    },
    {
        "name": "Epilepsy Pregnancy Planning Questions",
        "url": "https://media.epilepsypregnancy.com/wp-content/uploads/2025/06/epilepsy-pregnancy-planning-doctors-questions-EPMC.pdf",
        "description": "Questions to ask doctors when planning pregnancy with epilepsy",
        "filename": "epilepsy_pregnancy_planning_questions.pdf"
    },
    {
        "name": "Seizure Event Diary",
        "url": "https://www.epilepsy.com/sites/default/files/atoms/files/721SED_MySeizureEventDiary_05-2019-B.pdf",
        "description": "Seizure event diary for tracking seizures",
        "filename": "seizure_event_diary.pdf"
    }
]

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "application/pdf,application/octet-stream,*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
}

def download_pdf(url, filename, description):
    """Download PDF file and save it in proper PDF format."""
    try:
        print(f"📄 Downloading PDF: {filename}")
        print(f"   URL: {url}")
        print(f"   Description: {description}")
        
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        # Check if the response is actually a PDF
        content_type = response.headers.get('content-type', '').lower()
        if 'pdf' not in content_type and 'application/octet-stream' not in content_type:
            print(f"⚠️ Warning: Content type is {content_type}, may not be a PDF")
        
        # Check file size
        content_length = response.headers.get('content-length')
        if content_length:
            print(f"   File size: {int(content_length)} bytes")
        
        # Save the PDF file
        pdf_path = f"pdfs/{filename}"
        os.makedirs("pdfs", exist_ok=True)
        
        with open(pdf_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        # Verify the file was saved and is a PDF
        if os.path.exists(pdf_path):
            file_size = os.path.getsize(pdf_path)
            print(f"✅ Successfully downloaded: {filename} ({file_size} bytes)")
            
            # Check if file starts with PDF header
            with open(pdf_path, 'rb') as f:
                header = f.read(4)
                if header == b'%PDF':
                    print(f"✅ Verified: {filename} is a valid PDF file")
                    return {
                        "success": True,
                        "filename": filename,
                        "path": pdf_path,
                        "size": file_size,
                        "url": url,
                        "description": description
                    }
                else:
                    print(f"⚠️ Warning: {filename} may not be a valid PDF (header: {header})")
                    return {
                        "success": False,
                        "filename": filename,
                        "path": pdf_path,
                        "size": file_size,
                        "url": url,
                        "description": description,
                        "error": "Invalid PDF format"
                    }
        else:
            print(f"❌ Failed to save: {filename}")
            return {
                "success": False,
                "filename": filename,
                "url": url,
                "description": description,
                "error": "File not saved"
            }
            
    except Exception as e:
        print(f"❌ Error downloading {filename}: {e}")
        return {
            "success": False,
            "filename": filename,
            "url": url,
            "description": description,
            "error": str(e)
        }

def extract_all_pdfs():
    """Download all PDF resources and create a database."""
    pdf_database = {
        "extraction_info": {
            "total_pdfs": len(PDF_RESOURCES),
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "successful_downloads": 0,
            "failed_downloads": 0,
            "note": "PDF files downloaded and stored in proper PDF format"
        },
        "pdf_files": []
    }
    
    print(f"🌍 Starting PDF extraction for {len(PDF_RESOURCES)} PDF files...")
    print(f"📁 PDFs will be saved in: {os.path.abspath('pdfs/')}")
    
    for pdf in PDF_RESOURCES:
        result = download_pdf(pdf["url"], pdf["filename"], pdf["description"])
        pdf_database["pdf_files"].append(result)
        
        if result["success"]:
            pdf_database["extraction_info"]["successful_downloads"] += 1
        else:
            pdf_database["extraction_info"]["failed_downloads"] += 1
        
        # Be respectful - add delay between downloads
        time.sleep(2)
    
    return pdf_database

if __name__ == "__main__":
    print("🌍 Starting proper PDF extraction...")
    
    pdf_data = extract_all_pdfs()
    
    # Save the PDF database
    with open("pdf_database.json", "w", encoding="utf-8") as f:
        json.dump(pdf_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ PDF extraction complete!")
    print(f"📈 Successfully downloaded: {pdf_data['extraction_info']['successful_downloads']}/{pdf_data['extraction_info']['total_pdfs']} PDFs")
    print(f"❌ Failed downloads: {pdf_data['extraction_info']['failed_downloads']}")
    print(f"💾 PDF database saved to pdf_database.json")
    
    # Show downloaded files
    print(f"\n📁 Downloaded PDF files:")
    for pdf in pdf_data["pdf_files"]:
        if pdf["success"]:
            print(f"  ✅ {pdf['filename']} - {pdf['size']} bytes")
        else:
            print(f"  ❌ {pdf['filename']} - {pdf.get('error', 'Unknown error')}")
    
    # List files in pdfs directory
    if os.path.exists("pdfs"):
        print(f"\n📂 Files in pdfs directory:")
        for file in os.listdir("pdfs"):
            file_path = os.path.join("pdfs", file)
            if os.path.isfile(file_path):
                size = os.path.getsize(file_path)
                print(f"  📄 {file} - {size} bytes")
