import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton, LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserWithdrawalStatus() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    // Simulate fetching data from API
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {

    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch('https://hopeworkapi.azurewebsites.net/api/reward/withdraw-status', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Failed to fetch withdraw status');
      }
      const data = await response.json();
      console.log('TODO: check data', data)
      // This should be an actual API call
      const mockData = [
        { id: 1, status: 'Processing', amount: 100, date: '2023-05-15', method: 'PayPal' },
        { id: 2, status: 'Completed', amount: 200, date: '2023-05-10', method: 'Mobile Payment' },
        { id: 3, status: 'Pending', amount: 150, date: '2023-05-20', method: 'Blockchain Payment' },
      ];
      setWithdrawals(mockData);
    } catch (err) {
      // setError(err.message);
      // This should be an actual API call
      const mockData = [
        { id: 1, status: 'Processing', amount: 100, date: '2023-05-15', method: 'PayPal' },
        { id: 2, status: 'Completed', amount: 200, date: '2023-05-10', method: 'Mobile Payment' },
        { id: 3, status: 'Pending', amount: 150, date: '2023-05-20', method: 'Blockchain Payment' },
      ];
      setWithdrawals(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRewardSettlement = () => {
    navigate('/user/reward-settlement');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Loading withdraw status</Typography>
          <LinearProgress sx={{ mt: 2, mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Please wait...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#FFF3F3', border: '1px solid #FF6B6B' }}>
          <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
            An Error Occurred
          </Typography>
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
            sx={{
              mt: 2,
              backgroundColor: '#FF6B6B',
              '&:hover': {
                backgroundColor: '#FF4F4F',
              },
            }}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <IconButton 
        onClick={handleGoBack} 
        sx={{ 
          position: 'absolute', 
          top: '1rem', 
          left: '1rem', 
          fontSize: '1.5rem' 
        }}
      >
        ←
      </IconButton> 
      <Typography variant="h4" gutterBottom>Withdrawal Status</Typography>
      
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Payment Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawals.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.status}</TableCell>
                <TableCell align="right">${row.amount}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGoToRewardSettlement}
        sx={{ textTransform: 'none' }}
      >
        Return to Reward Settlement
      </Button>
    </Container>
  );
}

export default UserWithdrawalStatus;

