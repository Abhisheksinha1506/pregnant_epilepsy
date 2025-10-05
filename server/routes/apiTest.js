const express = require('express');
const axios = require('axios');
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

// Test API endpoint
router.post('/test', async (req, res) => {
  try {
    const { 
      url, 
      method = 'GET', 
      headers = {}, 
      body = null, 
      timeout = 30000,
      followRedirects = true 
    } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const startTime = Date.now();
    
    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Suite/1.0',
        ...headers
      },
      timeout,
      maxRedirects: followRedirects ? 5 : 0,
      validateStatus: () => true // Don't throw on HTTP error status codes
    };

    if (body && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
      config.data = body;
    }

    const response = await axios(config);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const result = {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      responseTime,
      size: JSON.stringify(response.data).length,
      timestamp: new Date().toISOString()
    };

    logger.info('API test completed', { 
      url, 
      method, 
      status: response.status, 
      responseTime 
    });

    res.json(result);
  } catch (error) {
    logger.error('API test failed', { error: error.message, url: req.body.url });
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

// Batch API testing
router.post('/batch', async (req, res) => {
  try {
    const { tests } = req.body;
    
    if (!Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ error: 'Tests array is required' });
    }

    const results = [];
    
    for (const test of tests) {
      try {
        const { 
          url, 
          method = 'GET', 
          headers = {}, 
          body = null, 
          timeout = 30000 
        } = test;

        const startTime = Date.now();
        
        const config = {
          method: method.toLowerCase(),
          url,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'API-Test-Suite/1.0',
            ...headers
          },
          timeout,
          validateStatus: () => true
        };

        if (body && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
          config.data = body;
        }

        const response = await axios(config);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        results.push({
          url,
          method,
          success: response.status >= 200 && response.status < 300,
          status: response.status,
          statusText: response.statusText,
          responseTime,
          size: JSON.stringify(response.data).length,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.push({
          url: test.url,
          method: test.method,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      averageResponseTime: results.reduce((acc, r) => acc + (r.responseTime || 0), 0) / results.length
    };

    res.json({ results, summary });
  } catch (error) {
    logger.error('Batch API test failed', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get API history
router.get('/history', (req, res) => {
  // This would typically fetch from a database
  // For now, return empty array
  res.json([]);
});

// Save API test configuration
router.post('/save', (req, res) => {
  try {
    const { name, config } = req.body;
    
    if (!name || !config) {
      return res.status(400).json({ error: 'Name and config are required' });
    }

    // This would typically save to a database
    // For now, just return success
    res.json({ 
      success: true, 
      message: 'Test configuration saved',
      id: Date.now().toString()
    });
  } catch (error) {
    logger.error('Save test configuration failed', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
