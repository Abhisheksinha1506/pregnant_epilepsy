const express = require('express');
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

// Generate chart data from dataset
router.post('/chart', (req, res) => {
  try {
    const { data, chartType, options = {} } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }

    let chartData = {};

    switch (chartType) {
      case 'line':
        chartData = generateLineChartData(data, options);
        break;
      case 'bar':
        chartData = generateBarChartData(data, options);
        break;
      case 'pie':
        chartData = generatePieChartData(data, options);
        break;
      case 'scatter':
        chartData = generateScatterChartData(data, options);
        break;
      case 'histogram':
        chartData = generateHistogramData(data, options);
        break;
      default:
        return res.status(400).json({ error: 'Invalid chart type' });
    }

    logger.info('Chart data generated', { chartType, dataPoints: data.length });

    res.json({
      chartType,
      data: chartData,
      metadata: {
        totalDataPoints: data.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Chart generation error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Generate summary statistics
router.post('/stats', (req, res) => {
  try {
    const { data, fields = [] } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }

    const stats = {};
    const numericFields = fields.length > 0 ? fields : getNumericFields(data);

    numericFields.forEach(field => {
      const values = data.map(item => parseFloat(item[field])).filter(val => !isNaN(val));
      
      if (values.length > 0) {
        stats[field] = {
          count: values.length,
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          median: getMedian(values),
          min: Math.min(...values),
          max: Math.max(...values),
          std: getStandardDeviation(values),
          nullCount: data.length - values.length
        };
      }
    });

    const summary = {
      totalRecords: data.length,
      numericFields: numericFields.length,
      categoricalFields: getCategoricalFields(data).length,
      generatedAt: new Date().toISOString()
    };

    res.json({ stats, summary });
  } catch (error) {
    logger.error('Statistics generation error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Generate correlation matrix
router.post('/correlation', (req, res) => {
  try {
    const { data, fields = [] } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }

    const numericFields = fields.length > 0 ? fields : getNumericFields(data);
    const correlationMatrix = {};

    numericFields.forEach(field1 => {
      correlationMatrix[field1] = {};
      numericFields.forEach(field2 => {
        if (field1 === field2) {
          correlationMatrix[field1][field2] = 1;
        } else {
          const values1 = data.map(item => parseFloat(item[field1])).filter(val => !isNaN(val));
          const values2 = data.map(item => parseFloat(item[field2])).filter(val => !isNaN(val));
          
          if (values1.length > 0 && values2.length > 0) {
            correlationMatrix[field1][field2] = calculateCorrelation(values1, values2);
          } else {
            correlationMatrix[field1][field2] = null;
          }
        }
      });
    });

    res.json({
      correlationMatrix,
      fields: numericFields,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Correlation calculation error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function generateLineChartData(data, options) {
  const { xField, yField, groupBy } = options;
  
  if (!xField || !yField) {
    throw new Error('xField and yField are required for line chart');
  }

  const datasets = {};
  
  data.forEach(item => {
    const x = item[xField];
    const y = parseFloat(item[yField]);
    const group = groupBy ? item[groupBy] : 'default';
    
    if (!datasets[group]) {
      datasets[group] = [];
    }
    
    datasets[group].push({ x, y });
  });

  return Object.keys(datasets).map(group => ({
    label: group,
    data: datasets[group].sort((a, b) => a.x - b.x)
  }));
}

function generateBarChartData(data, options) {
  const { xField, yField } = options;
  
  if (!xField || !yField) {
    throw new Error('xField and yField are required for bar chart');
  }

  const categories = {};
  
  data.forEach(item => {
    const category = item[xField];
    const value = parseFloat(item[yField]);
    
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += value;
  });

  return Object.keys(categories).map(category => ({
    label: category,
    value: categories[category]
  }));
}

function generatePieChartData(data, options) {
  const { field } = options;
  
  if (!field) {
    throw new Error('field is required for pie chart');
  }

  const categories = {};
  
  data.forEach(item => {
    const category = item[field];
    categories[category] = (categories[category] || 0) + 1;
  });

  return Object.keys(categories).map(category => ({
    label: category,
    value: categories[category]
  }));
}

function generateScatterChartData(data, options) {
  const { xField, yField, colorField } = options;
  
  if (!xField || !yField) {
    throw new Error('xField and yField are required for scatter chart');
  }

  return data.map(item => ({
    x: parseFloat(item[xField]),
    y: parseFloat(item[yField]),
    color: colorField ? item[colorField] : undefined
  })).filter(point => !isNaN(point.x) && !isNaN(point.y));
}

function generateHistogramData(data, options) {
  const { field, bins = 10 } = options;
  
  if (!field) {
    throw new Error('field is required for histogram');
  }

  const values = data.map(item => parseFloat(item[field])).filter(val => !isNaN(val));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;
  
  const histogram = Array(bins).fill(0);
  
  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
    histogram[binIndex]++;
  });

  return histogram.map((count, index) => ({
    bin: min + (index * binSize),
    count
  }));
}

function getNumericFields(data) {
  if (data.length === 0) return [];
  
  return Object.keys(data[0]).filter(field => {
    return data.some(item => {
      const value = parseFloat(item[field]);
      return !isNaN(value);
    });
  });
}

function getCategoricalFields(data) {
  if (data.length === 0) return [];
  
  return Object.keys(data[0]).filter(field => {
    return data.some(item => {
      const value = item[field];
      return typeof value === 'string' || typeof value === 'boolean';
    });
  });
}

function getMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function getStandardDeviation(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

function calculateCorrelation(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

module.exports = router;
