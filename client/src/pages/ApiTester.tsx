import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  ExpandMore,
  ContentCopy,
  CheckCircle,
  Error,
  Schedule,
} from '@mui/icons-material';
import axios from 'axios';

interface ApiTestResult {
  success: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  size: number;
  timestamp: string;
}

const ApiTester: React.FC = () => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testHistory, setTestHistory] = useState<ApiTestResult[]>([]);

  const handleTest = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const startTime = Date.now();
      
      const config = {
        method: method.toLowerCase(),
        url,
        headers: headers ? JSON.parse(headers) : {},
        data: body ? JSON.parse(body) : undefined,
        timeout: 30000,
      };

      const response = await axios(config);
      const endTime = Date.now();

      const testResult: ApiTestResult = {
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        responseTime: endTime - startTime,
        size: JSON.stringify(response.data).length,
        timestamp: new Date().toISOString(),
      };

      setResult(testResult);
      setTestHistory(prev => [testResult, ...prev.slice(0, 9)]);
    } catch (err: any) {
      const testResult: ApiTestResult = {
        success: false,
        status: err.response?.status || 0,
        statusText: err.response?.statusText || 'Network Error',
        headers: err.response?.headers || {},
        data: err.response?.data || err.message,
        responseTime: 0,
        size: 0,
        timestamp: new Date().toISOString(),
      };

      setResult(testResult);
      setTestHistory(prev => [testResult, ...prev.slice(0, 9)]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Tester
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Method</InputLabel>
                <Select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  label="Method"
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
              
              <Button
                variant="contained"
                onClick={handleTest}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Testing...' : 'Test API'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Headers (JSON)"
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{"Content-Type": "application/json"}'
                multiline
                rows={2}
              />
              
              <TextField
                fullWidth
                label="Body (JSON)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}'
                multiline
                rows={2}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">Test Result</Typography>
              <Chip
                icon={result.success ? <CheckCircle /> : <Error />}
                label={result.success ? 'Success' : 'Failed'}
                color={result.success ? 'success' : 'error'}
              />
              <Chip
                icon={<Schedule />}
                label={`${result.responseTime}ms`}
                variant="outlined"
              />
            </Box>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Response Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Status: {result.status} {result.statusText}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Size: {result.size} bytes
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Time: {new Date(result.timestamp).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Response Data:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        value={JSON.stringify(result.data, null, 2)}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                      />
                      <Tooltip title="Copy to clipboard">
                        <IconButton onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {testHistory.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test History
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Method</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Response Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testHistory.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell>{method}</TableCell>
                      <TableCell>{url}</TableCell>
                      <TableCell>
                        <Chip
                          icon={test.success ? <CheckCircle /> : <Error />}
                          label={`${test.status} ${test.statusText}`}
                          color={test.success ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(test.timestamp).toLocaleTimeString()}</TableCell>
                      <TableCell>{test.responseTime}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ApiTester;