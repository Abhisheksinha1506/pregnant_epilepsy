const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const router = express.Router();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.json', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, JSON, and TXT files are allowed'));
    }
  }
});

// Upload and parse CSV file
router.post('/upload/csv', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        
        const summary = {
          totalRows: results.length,
          columns: results.length > 0 ? Object.keys(results[0]) : [],
          sampleData: results.slice(0, 5),
          fileInfo: {
            originalName: req.file.originalname,
            size: req.file.size,
            uploadedAt: new Date().toISOString()
          }
        };

        logger.info('CSV file processed', { 
          rows: results.length, 
          columns: summary.columns.length 
        });

        res.json({ data: results, summary });
      })
      .on('error', (error) => {
        logger.error('CSV parsing error', { error: error.message });
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });
  } catch (error) {
    logger.error('CSV upload error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Upload and parse JSON file
router.post('/upload/json', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    let data;
    try {
      data = JSON.parse(fileContent);
    } catch (parseError) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    const isArray = Array.isArray(data);
    const summary = {
      type: isArray ? 'array' : 'object',
      totalItems: isArray ? data.length : 1,
      sampleData: isArray ? data.slice(0, 5) : data,
      fileInfo: {
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedAt: new Date().toISOString()
      }
    };

    logger.info('JSON file processed', { 
      type: summary.type, 
      items: summary.totalItems 
    });

    res.json({ data, summary });
  } catch (error) {
    logger.error('JSON upload error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Connect to external API data source
router.post('/api', async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, params = {} } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const axios = require('axios');
    const response = await axios({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      params,
      timeout: 30000
    });

    const data = response.data;
    const isArray = Array.isArray(data);
    
    const summary = {
      source: 'API',
      url,
      method,
      type: isArray ? 'array' : 'object',
      totalItems: isArray ? data.length : 1,
      sampleData: isArray ? data.slice(0, 5) : data,
      status: response.status,
      headers: response.headers,
      fetchedAt: new Date().toISOString()
    };

    logger.info('API data fetched', { url, method, items: summary.totalItems });

    res.json({ data, summary });
  } catch (error) {
    logger.error('API data fetch error', { error: error.message, url: req.body.url });
    res.status(500).json({ error: error.message });
  }
});

// Get data source statistics
router.get('/stats/:sourceId', (req, res) => {
  try {
    const { sourceId } = req.params;
    
    // This would typically fetch from database
    // For now, return mock data
    const stats = {
      sourceId,
      totalRecords: 1000,
      lastUpdated: new Date().toISOString(),
      dataQuality: {
        completeness: 95.5,
        accuracy: 98.2,
        consistency: 92.1
      },
      fields: [
        { name: 'id', type: 'number', nullCount: 0 },
        { name: 'name', type: 'string', nullCount: 5 },
        { name: 'email', type: 'string', nullCount: 2 },
        { name: 'created_at', type: 'date', nullCount: 0 }
      ]
    };

    res.json(stats);
  } catch (error) {
    logger.error('Get data source stats error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Transform data
router.post('/transform', (req, res) => {
  try {
    const { data, transformations } = req.body;

    if (!data || !transformations) {
      return res.status(400).json({ error: 'Data and transformations are required' });
    }

    let transformedData = Array.isArray(data) ? [...data] : [data];

    // Apply transformations
    transformations.forEach(transform => {
      switch (transform.type) {
        case 'filter':
          transformedData = transformedData.filter(item => {
            return eval(`item.${transform.field} ${transform.operator} ${JSON.stringify(transform.value)}`);
          });
          break;
        case 'map':
          transformedData = transformedData.map(item => {
            const newItem = { ...item };
            if (transform.newField) {
              newItem[transform.newField] = eval(`item.${transform.expression}`);
            }
            return newItem;
          });
          break;
        case 'sort':
          transformedData.sort((a, b) => {
            const aVal = a[transform.field];
            const bVal = b[transform.field];
            return transform.order === 'desc' ? bVal - aVal : aVal - bVal;
          });
          break;
      }
    });

    const summary = {
      originalCount: Array.isArray(data) ? data.length : 1,
      transformedCount: transformedData.length,
      transformations: transformations.length,
      processedAt: new Date().toISOString()
    };

    res.json({ data: transformedData, summary });
  } catch (error) {
    logger.error('Data transformation error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
