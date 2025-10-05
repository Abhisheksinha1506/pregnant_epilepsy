#!/bin/bash

# Setup script for API environment variables
echo "🔧 Setting up API environment variables..."

# Create .env.local file with your API key
cat > .env.local << EOF
# API Integration Environment Variables
# Your actual API keys

# OpenFDA API Configuration (Free - no key required)
OPENFDA_API_KEY=
OPENFDA_BASE_URL=https://api.fda.gov

# NIH DailyMed API Configuration (Free - no key required)
NIH_API_KEY=
NIH_BASE_URL=https://dailymed.nlm.nih.gov

# CDC API Configuration (Your data.gov API key)
CDC_API_KEY=fFt8BXZyAquXV2N9cenM3C0BmRTWGrwWgxeVrJ0Z
CDC_BASE_URL=https://data.cdc.gov

# WHO API Configuration (if available)
WHO_API_KEY=
WHO_BASE_URL=https://apps.who.int

# Epilepsy Foundation API Configuration (if available)
EPILEPSY_FOUNDATION_API_KEY=
EPILEPSY_FOUNDATION_BASE_URL=https://www.epilepsy.com

# Rate Limiting Configuration
API_RATE_LIMIT=100
API_RATE_WINDOW=60000

# Cache Configuration
CACHE_TTL=300000
CACHE_MAX_SIZE=1000

# Development Settings
NODE_ENV=development
DEBUG_API_CALLS=true
EOF

echo "✅ Environment file created: .env.local"
echo "🔑 Your CDC API key has been configured"
echo "📝 You can now test the APIs with your key"
