import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, IconButton,
    LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserRewardSettlement() {
  const navigate = useNavigate();
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRewardHistory();
  }, []);

  const fetchRewardHistory = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch('https://hopeworkapi.azurewebsites.net/api/reward/history', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Failed to fetch task list');
      }
      const data = await response.json();
      console.log('TODO: check data', data)
      // This should be an actual API call
      const mockData = [
        { id: 1, taskName: 'Task 1', amount: 100, date: '2023-05-01' },
        { id: 2, taskName: 'Task 2', amount: 150, date: '2023-05-05' },
        { id: 3, taskName: 'Task 3', amount: 200, date: '2023-05-10' },
      ];
      setIncomeHistory(mockData);
      setTotalIncome(mockData.reduce((sum, item) => sum + item.amount, 0));
      setAvailableBalance(350); // Assume available balance
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reward settlement:', err);
      // This should be an actual API call
      const mockData = [
        { id: 1, taskName: 'Task 1', amount: 100, date: '2023-05-01' },
        { id: 2, taskName: 'Task 2', amount: 150, date: '2023-05-05' },
        { id: 3, taskName: 'Task 3', amount: 200, date: '2023-05-10' },
      ];
      setIncomeHistory(mockData);
      setTotalIncome(mockData.reduce((sum, item) => sum + item.amount, 0));
      setAvailableBalance(350); // Assume available balance
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalMethodChange = (event) => {
    setWithdrawalMethod(event.target.value);
  };

  const handleInitiateWithdrawal = () => {
    if (!withdrawalMethod) {
      alert('Please select a withdrawal method');
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => {
      controller.abort();
    }, 2000);
    fetch(`https://hopeworkapi.azurewebsites.net/api/reward/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        withdrawalMethod: withdrawalMethod
      }),
      signal
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error reward withdraw:', error);
      // alert('Failed to reward withdraw. Please try again.');
    })
    .finally(data => {
      alert('Reward withdraw successful');
      console.log('Reward withdraw:', data);
      navigate('/user/withdrawal-status');
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Loading reward withdraw</Typography>
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
      <Typography variant="h4" gutterBottom>Reward Settlement</Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Income Overview</Typography>
        <Typography>Total Income: ${totalIncome}</Typography>
        <Typography>Current Available Balance: ${availableBalance}</Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomeHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.taskName}</TableCell>
                <TableCell align="right">${row.amount}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Withdrawal Method</InputLabel>
        <Select
          value={withdrawalMethod}
          label="Withdrawal Method"
          onChange={handleWithdrawalMethodChange}
        >
          <MenuItem value="paypal">PayPal</MenuItem>
          <MenuItem value="mobileMoney">Mobile Money</MenuItem>
          <MenuItem value="blockchain">Blockchain Payment</MenuItem>
        </Select>
      </FormControl>

      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={handleInitiateWithdrawal}
        sx={{ textTransform: 'none' }}
      >
        Initiate Withdrawal
      </Button>
    </Container>
  );
}

export default UserRewardSettlement;

