# Environment Variables Documentation

This document lists all environment variables used in the Seizure Pregnancy Navigator application.

## Required Environment Variables

### API Keys
- `OPENFDA_API_KEY` - OpenFDA API key for medication data
- `NIH_API_KEY` - NIH DailyMed API key for medication information  
- `CDC_API_KEY` - CDC API key for health guidelines

### API Base URLs
- `OPENFDA_BASE_URL` - OpenFDA API base URL (default: https://api.fda.gov)
- `NIH_BASE_URL` - NIH DailyMed API base URL (default: https://dailymed.nlm.nih.gov)
- `CDC_BASE_URL` - CDC API base URL (default: https://data.cdc.gov)

### Application Variables
- `NODE_ENV` - Environment (development, production)
- `CUSTOM_KEY` - Custom application key

## Vercel Environment Variables

### Automatic Variables
- `VERCEL_URL` - Deployment URL
- `VERCEL_REGION` - Deployment region
- `VERCEL_ENV` - Environment (development, preview, production)

## How to Check Environment Variables

### 1. API Endpoint
Visit: `https://your-app.vercel.app/api/env-check`

This will return a JSON response with:
- Status of all environment variables
- Missing required variables
- Environment information
- Vercel deployment details

### 2. Frontend Component
The EnvironmentStatus component shows:
- Real-time environment variable status
- Missing required variables
- Variable values (masked for security)
- Last checked timestamp

### 3. Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Check if all required variables are set
4. Verify they're enabled for the correct environments

### 4. Function Logs
Check Vercel function logs for environment variable status:
1. Go to your deployment
2. Click on "Functions" tab
3. Check logs for environment variable status messages

## Environment Variable Status Codes

- `HEALTHY` - All required variables are present
- `WARNING` - Some optional variables are missing
- `ERROR` - Required variables are missing

## Security Notes

- API keys are masked in logs and responses
- Only non-sensitive environment variables are exposed
- Keys containing 'SECRET', 'PASSWORD', 'TOKEN', or 'KEY' are automatically masked

## Troubleshooting

### Missing Environment Variables
1. Check Vercel project settings
2. Ensure variables are set for the correct environment
3. Redeploy after adding new variables
4. Check the `/api/env-check` endpoint

### API Connection Issues
1. Verify API keys are correct
2. Check API base URLs
3. Ensure API keys have proper permissions
4. Check function logs for connection errors

### Development vs Production
- Environment variables may differ between environments
- Check both development and production settings
- Use the environment status component to verify
