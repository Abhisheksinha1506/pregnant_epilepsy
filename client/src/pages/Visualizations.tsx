import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ScatterChart as RechartsScatterChart,
  Scatter,
} from 'recharts';

interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  xField: string;
  yField: string;
  colorField?: string;
  title: string;
}

const Visualizations: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'line',
    xField: 'name',
    yField: 'value',
    title: 'Sample Chart',
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const mockData = [
    { name: 'Jan', value: 100, category: 'A' },
    { name: 'Feb', value: 150, category: 'B' },
    { name: 'Mar', value: 120, category: 'A' },
    { name: 'Apr', value: 180, category: 'C' },
    { name: 'May', value: 200, category: 'B' },
    { name: 'Jun', value: 160, category: 'A' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    setChartData(mockData);
  }, [mockData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const generateChart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChartData(mockData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartData.length) return null;

    switch (chartConfig.type) {
      case 'line':
        return (
          <RechartsLineChart data={chartData} height={400}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xField} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={chartConfig.yField} stroke="#1976d2" strokeWidth={2} />
          </RechartsLineChart>
        );

      case 'bar':
        return (
          <RechartsBarChart data={chartData} height={400}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xField} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={chartConfig.yField} fill="#1976d2" />
          </RechartsBarChart>
        );

      case 'pie':
        return (
          <RechartsPieChart height={400}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        );

      case 'scatter':
        return (
          <RechartsScatterChart data={chartData} height={400}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Scatter dataKey="y" fill="#1976d2" />
          </RechartsScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Visualizations
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Create Chart" />
            <Tab label="Chart Gallery" />
          </Tabs>
        </Box>

        <CardContent>
          {tabValue === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">Chart Configuration</Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Chart Type</InputLabel>
                    <Select
                      value={chartConfig.type}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, type: e.target.value as any }))}
                      label="Chart Type"
                    >
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="bar">Bar Chart</MenuItem>
                      <MenuItem value="pie">Pie Chart</MenuItem>
                      <MenuItem value="scatter">Scatter Plot</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="X Field"
                    value={chartConfig.xField}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, xField: e.target.value }))}
                    sx={{ minWidth: 120 }}
                  />

                  <TextField
                    label="Y Field"
                    value={chartConfig.yField}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, yField: e.target.value }))}
                    sx={{ minWidth: 120 }}
                  />

                  <TextField
                    label="Chart Title"
                    value={chartConfig.title}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, title: e.target.value }))}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={generateChart}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <BarChartIcon />}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {loading ? 'Generating...' : 'Generate Chart'}
                </Button>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  {chartConfig.title}
                </Typography>
                <Box sx={{ height: 400 }}>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart() || <div>No chart data</div>}
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #ccc',
                        borderRadius: 1,
                      }}
                    >
                      <Typography color="textSecondary">
                        No chart data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Chart Gallery
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Card sx={{ minWidth: 300 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sample Line Chart
                    </Typography>
                    <Box sx={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={mockData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#1976d2" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ minWidth: 300 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sample Bar Chart
                    </Typography>
                    <Box sx={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={mockData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#1976d2" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Visualizations;