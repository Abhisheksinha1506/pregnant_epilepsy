import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload,
  Api,
  Storage,
  Delete,
  Visibility,
  Add,
} from '@mui/icons-material';

interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'api';
  size: number;
  createdAt: string;
  status: 'active' | 'processing' | 'error';
}

const DataSources: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Sample CSV Data',
      type: 'csv',
      size: 1024,
      createdAt: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'API Endpoint',
      type: 'api',
      size: 0,
      createdAt: '2024-01-14',
      status: 'active',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleApiSubmit = () => {
    if (!apiUrl) {
      setError('Please enter a valid API URL');
      return;
    }

    setLoading(true);
    // Simulate API connection
    setTimeout(() => {
      const newDataSource: DataSource = {
        id: Date.now().toString(),
        name: `API: ${apiUrl}`,
        type: 'api',
        size: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setDataSources(prev => [newDataSource, ...prev]);
      setLoading(false);
      setApiUrl('');
    }, 2000);
  };

  const handleFileSubmit = () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    // Simulate file processing
    setTimeout(() => {
      const newDataSource: DataSource = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: selectedFile.name.endsWith('.csv') ? 'csv' : 'json',
        size: selectedFile.size,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setDataSources(prev => [newDataSource, ...prev]);
      setLoading(false);
      setSelectedFile(null);
    }, 2000);
  };

  const handlePreview = (dataSource: DataSource) => {
    // Mock preview data
    setPreviewData([
      { id: 1, name: 'Sample Data 1', value: 100 },
      { id: 2, name: 'Sample Data 2', value: 200 },
      { id: 3, name: 'Sample Data 3', value: 150 },
    ]);
    setPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    setDataSources(prev => prev.filter(ds => ds.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Data Sources
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Upload File" />
            <Tab label="Connect API" />
            <Tab label="Manage Sources" />
          </Tabs>
        </Box>

        <CardContent>
          {tabValue === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upload Data File
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2">
                    Selected: {selectedFile.name}
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={handleFileSubmit}
                disabled={!selectedFile || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Add />}
              >
                {loading ? 'Processing...' : 'Upload File'}
              </Button>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" gutterBottom>
                Connect to API
              </Typography>
              <TextField
                fullWidth
                label="API URL"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/data"
              />
              <Button
                variant="contained"
                onClick={handleApiSubmit}
                disabled={!apiUrl || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Api />}
              >
                {loading ? 'Connecting...' : 'Connect API'}
              </Button>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Data Sources ({dataSources.length})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataSources.map((dataSource) => (
                      <TableRow key={dataSource.id}>
                        <TableCell>{dataSource.name}</TableCell>
                        <TableCell>
                          <Chip
                            icon={dataSource.type === 'api' ? <Api /> : <Storage />}
                            label={dataSource.type.toUpperCase()}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {dataSource.size > 0 ? `${(dataSource.size / 1024).toFixed(1)} KB` : 'N/A'}
                        </TableCell>
                        <TableCell>{dataSource.createdAt}</TableCell>
                        <TableCell>
                          <Chip
                            label={dataSource.status}
                            color={dataSource.status === 'active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handlePreview(dataSource)}>
                            <Visibility />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(dataSource.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Data Preview</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataSources;