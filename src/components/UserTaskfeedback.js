import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, CircularProgress, Button, Alert, Paper, IconButton,
  Box, Chip, Grid
} from '@mui/material';

function UserTaskFeedback() {
  const { id } = useParams(); // 重新添加 id
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaskFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`https://hopeworkapi.azurewebsites.net/api/task/${id}/feedback`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Failed to fetch task details');
      }
      const feedback = await response.json();
      setFeedback(feedback);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching task feedback:', err);
      // Mock feedback data
      const mockFeedback = {
        result: 'Approved',
        comment: 'Task completed well, quality meets requirements. Thank you for your hard work!',
        totalReward: 100,
        actualReward: 95
      };
      setFeedback(mockFeedback);
    } finally {
      setLoading(false);
    }
  }, [id]); // 添加 id 作为依赖项

  useEffect(() => {
    fetchTaskFeedback();
  }, [fetchTaskFeedback]);

  const handleViewReward= () => {
    // Logic to view reward
    console.log('View reward:');
    navigate('/user/reward-settlement');    
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
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
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Task Feedback
      </Typography>
      
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Task Feedback Details
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Review Result:
            </Typography>
            <Chip 
              label={feedback.result} 
              color={feedback.result === 'Approved' ? 'success' : 'error'}
              sx={{ fontSize: '1rem', py: 0.5 }}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Review Comments:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body1">
                {feedback.comment}
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Reward Distribution:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">
                  Total Reward: ${feedback.totalReward}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  Actual Earned: ${feedback.actualReward}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewReward}
            sx={{ mt: 2 }}
          >
            View Detailed Reward Information
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default UserTaskFeedback;

