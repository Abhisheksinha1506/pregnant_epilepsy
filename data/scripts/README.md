# Data Extraction Scripts

This folder contains all the Python scripts used to extract real health and pregnancy data from various authoritative sources.

## Scripts Overview

### Core Data Extraction Scripts

#### `extract_cdc_data.py`
- **Purpose**: Extract CDC medicine and pregnancy data
- **Source**: https://www.cdc.gov/medicine-and-pregnancy/about/index.html
- **Output**: `cdc_medicine_pregnancy.json`
- **Data**: Real CDC statistics and information about medication use during pregnancy

#### `extract_cdc_reproductive_health.py`
- **Purpose**: Extract CDC reproductive health data
- **Source**: https://www.cdc.gov/reproductivehealth/index.html
- **Output**: `cdc_reproductive_health_data.json`
- **Data**: CDC reproductive health initiatives and programs

#### `extract_pregnancy_data.py`
- **Purpose**: Comprehensive pregnancy data extraction from multiple sources
- **Sources**: American Pregnancy Association, NIH, WHO
- **Output**: `comprehensive_pregnancy_data.json`
- **Data**: Multi-source pregnancy information and resources

#### `extract_additional_pregnancy_sources.py`
- **Purpose**: Extract additional pregnancy data from alternative sources
- **Sources**: Healthline, Mayo Clinic, WebMD, Cleveland Clinic
- **Output**: `additional_pregnancy_data.json`
- **Data**: Additional pregnancy health information

#### `extract_alternative_health_data.py`
- **Purpose**: Extract health data from alternative accessible sources
- **Sources**: NIH News, CDC News, WHO News
- **Output**: `alternative_health_data.json`
- **Data**: Health research and news updates

#### `extract_drug_safety_data.py`
- **Purpose**: Extract drug safety information
- **Sources**: NIH, CDC, WHO drug safety resources
- **Output**: `drug_safety_data.json`
- **Data**: Drug safety communications and research

#### `extract_epilepsy_pregnancy_data.py`
- **Purpose**: Extract epilepsy and pregnancy data from specialized sources
- **Sources**: Epilepsy Foundation, Empowering Epilepsy, Mother to Baby
- **Output**: `epilepsy_pregnancy_comprehensive_data.json`
- **Data**: Specialized epilepsy and pregnancy information

#### `extract_pdf_data_properly.py`
- **Purpose**: Download and extract PDF documents in proper PDF format
- **Sources**: RCOG guidelines, Epilepsy Foundation PDFs
- **Output**: `pdf_database.json` + PDF files in `pdfs/` folder
- **Data**: PDF documents for document analysis

### Database Creation Scripts

#### `create_epilepsy_pregnancy_database.py`
- **Purpose**: Create comprehensive epilepsy and pregnancy database
- **Output**: `epilepsy_pregnancy_comprehensive_database.json`
- **Data**: Structured epilepsy and pregnancy information from medical sources

#### `create_pregnancy_registry_database.py`
- **Purpose**: Create pregnancy exposure registry database
- **Output**: `pregnancy_registry_comprehensive_database.json`
- **Data**: FDA pregnancy registries and RCOG guidelines information

## Usage

All scripts can be run independently:

```bash
# Example: Extract CDC data
python3 extract_cdc_data.py

# Example: Extract comprehensive pregnancy data
python3 extract_pregnancy_data.py

# Example: Download PDFs
python3 extract_pdf_data_properly.py
```

## Output

All scripts generate JSON files in the parent directory (`../`) with structured, real data from authoritative medical sources.

## Data Sources

- **CDC**: Centers for Disease Control and Prevention
- **NIH**: National Institutes of Health
- **WHO**: World Health Organization
- **Epilepsy Foundation**: Epilepsy and seizure resources
- **RCOG**: Royal College of Obstetricians and Gynaecologists
- **American Pregnancy Association**: Pregnancy resources
- **Mother to Baby**: Medication safety during pregnancy

## Notes

- All scripts extract **100% real data** - no mock data
- Scripts include error handling and respectful delays
- PDFs are downloaded in proper PDF format
- All data is sourced from authoritative medical institutions
