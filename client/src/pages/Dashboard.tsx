import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  Api,
  Storage,
  Refresh,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalTests: number;
  successfulTests: number;
  failedTests: number;
  averageResponseTime: number;
  dataSources: number;
  visualizations: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTests: 0,
    successfulTests: 0,
    failedTests: 0,
    averageResponseTime: 0,
    dataSources: 0,
    visualizations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTests, setRecentTests] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now
      setStats({
        totalTests: 156,
        successfulTests: 142,
        failedTests: 14,
        averageResponseTime: 245,
        dataSources: 8,
        visualizations: 12,
      });

      setRecentTests([
        { id: 1, name: 'User API Test', status: 'success', time: '2m ago' },
        { id: 2, name: 'Data Processing', status: 'success', time: '5m ago' },
        { id: 3, name: 'Health Check', status: 'failed', time: '8m ago' },
        { id: 4, name: 'Analytics API', status: 'success', time: '12m ago' },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const successRate = stats.totalTests > 0 ? (stats.successfulTests / stats.totalTests) * 100 : 0;

  const chartData = [
    { name: 'Mon', tests: 24 },
    { name: 'Tue', tests: 18 },
    { name: 'Wed', tests: 32 },
    { name: 'Thu', tests: 28 },
    { name: 'Fri', tests: 35 },
    { name: 'Sat', tests: 12 },
    { name: 'Sun', tests: 8 },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Tests
                </Typography>
                <Typography variant="h4">
                  {stats.totalTests}
                </Typography>
              </Box>
              <Api color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Success Rate
                </Typography>
                <Typography variant="h4">
                  {successRate.toFixed(1)}%
                </Typography>
              </Box>
              <CheckCircle color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Avg Response Time
                </Typography>
                <Typography variant="h4">
                  {stats.averageResponseTime}ms
                </Typography>
              </Box>
              <TrendingUp color="info" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Data Sources
                </Typography>
                <Typography variant="h4">
                  {stats.dataSources}
                </Typography>
              </Box>
              <Storage color="secondary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts and Recent Activity */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Card sx={{ flex: 2, minWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Activity (Last 7 Days)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tests" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
                Recent Tests
              </Typography>
              <IconButton onClick={fetchDashboardData}>
                <Refresh />
              </IconButton>
            </Box>
            <List>
              {recentTests.map((test) => (
                <ListItem key={test.id} divider>
                  <ListItemIcon>
                    {test.status === 'success' ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Error color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={test.name}
                    secondary={test.time}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;