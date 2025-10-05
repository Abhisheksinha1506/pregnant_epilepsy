# API Test Suite

A comprehensive web application for testing APIs and analyzing data sources with modern visualization capabilities.

## Features

### 🚀 API Testing
- **RESTful API Testing**: Test GET, POST, PUT, PATCH, DELETE requests
- **Request Configuration**: Custom headers, body, timeout settings
- **Response Analysis**: Status codes, response times, data inspection
- **Test History**: Track and review previous test results
- **Batch Testing**: Run multiple API tests simultaneously

### 📊 Data Sources
- **File Upload**: Support for CSV and JSON file uploads
- **API Integration**: Connect to external APIs for real-time data
- **Data Preview**: Preview uploaded data before processing
- **Data Management**: Organize and manage multiple data sources

### 📈 Visualizations
- **Interactive Charts**: Line, bar, pie, scatter plots
- **Data Statistics**: Comprehensive statistical analysis
- **Correlation Analysis**: Identify relationships between data points
- **Export Options**: Save visualizations and reports

### 🎨 Modern UI
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material-UI Components**: Beautiful, accessible interface
- **Dark/Light Theme**: Customizable appearance
- **Real-time Updates**: Live data and status updates

## Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston for comprehensive logging
- **File Processing**: Multer for file uploads, CSV parser

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API communication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd api-test-suite
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Setup

If you prefer to set up manually:

1. **Backend Setup**
   ```bash
   npm install
   npm start
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm start
   ```

## Usage

### API Testing
1. Navigate to the "API Tester" page
2. Configure your API request:
   - Enter the URL
   - Select HTTP method
   - Add headers if needed
   - Include request body for POST/PUT requests
3. Click "Run Test" to execute the request
4. Review the response data, headers, and timing information

### Data Sources
1. Go to "Data Sources" page
2. Upload CSV or JSON files, or connect to an API
3. Preview your data before using it for analysis
4. Manage your data sources from the "Manage Sources" tab

### Visualizations
1. Visit the "Visualizations" page
2. Select your data source and chart type
3. Configure X and Y axes
4. Generate interactive charts and analyze your data

## API Endpoints

### API Testing
- `POST /api/test/test` - Test a single API endpoint
- `POST /api/test/batch` - Run multiple API tests
- `GET /api/test/history` - Get test history
- `POST /api/test/save` - Save test configuration

### Data Sources
- `POST /api/data/upload/csv` - Upload CSV file
- `POST /api/data/upload/json` - Upload JSON file
- `POST /api/data/api` - Connect to external API
- `GET /api/data/stats/:sourceId` - Get data source statistics
- `POST /api/data/transform` - Transform data

### Visualizations
- `POST /api/visualize/chart` - Generate chart data
- `POST /api/visualize/stats` - Get data statistics
- `POST /api/visualize/correlation` - Calculate correlations

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Security Features
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers and protection
- **Input Validation**: Request validation and sanitization

## Development

### Project Structure
```
api-test-suite/
├── server/                 # Backend Express server
│   ├── routes/            # API route handlers
│   ├── uploads/           # File upload storage
│   └── logs/              # Application logs
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
└── package.json           # Dependencies and scripts
```

### Available Scripts
- `npm start` - Start the backend server
- `npm run dev` - Start both backend and frontend
- `npm run client` - Start only the frontend
- `npm run build` - Build the frontend for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions, issues, or contributions, please open an issue on the GitHub repository.
