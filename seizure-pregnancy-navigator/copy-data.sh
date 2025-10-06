#!/bin/bash

# Copy essential data files to the Next.js app directory for Vercel deployment
echo "Copying data files for Vercel deployment..."

# Create data directory if it doesn't exist
mkdir -p data

# Copy essential JSON data files
cp ../data/comprehensive_epilepsy_medications.json data/ 2>/dev/null || echo "comprehensive_epilepsy_medications.json not found"
cp ../data/epilepsy_medication_safety_database.json data/ 2>/dev/null || echo "epilepsy_medication_safety_database.json not found"
cp ../data/epilepsy_pregnancy_comprehensive_database.json data/ 2>/dev/null || echo "epilepsy_pregnancy_comprehensive_database.json not found"
cp ../data/medical_terms_glossary.json data/ 2>/dev/null || echo "medical_terms_glossary.json not found"
cp ../data/comprehensive_pregnancy_data.json data/ 2>/dev/null || echo "comprehensive_pregnancy_data.json not found"

# Copy CSV files
cp ../data/seizure_tracking_log.csv data/ 2>/dev/null || echo "seizure_tracking_log.csv not found"
cp ../data/epilepsy_medications.csv data/ 2>/dev/null || echo "epilepsy_medications.csv not found"
cp ../data/pregnancy_tracking_schedule.csv data/ 2>/dev/null || echo "pregnancy_tracking_schedule.csv not found"

echo "Data files copied successfully!"
echo "Files in data directory:"
ls -la data/
