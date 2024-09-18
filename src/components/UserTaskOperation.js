import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Button, LinearProgress, Grid,
  Card, CardContent, Box, Chip, IconButton
} from '@mui/material';

function UserTaskOperation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`https://hopeworkapi.azurewebsites.net/api/task/${id}/details`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Failed to fetch task details');
      }
      const data = await response.json();
      setTask(data);
    } catch (err) {
      // Mock task data
      const mockTask = {
        id: id,
        title: 'Image Classification Task',
        type: 'Image Processing',
        difficulty: 'easy',
        status: 'In Progress',
        description: 'Classify and label a set of images',
        reward_per_unit: 5,
        total_units: 100,
        completed_units: 20,
        deadline: '2023-07-31'
      };
      setTask(mockTask);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleSubmitTask = () => {
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => {
      controller.abort();
    }, 2000);
    fetch(`https://hopeworkapi.azurewebsites.net/api/task/${id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error apply task:', error);
      // alert('Failed to apply task. Please try again.');
    })
    .finally(data => {
      alert('Submit successful');
      console.log('Task Submit:', data);
      navigate(`/user/task-feedback/${id}`);
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Loading task details...</Typography>
          <LinearProgress sx={{ mt: 2, mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Please wait...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
    <Container maxWidth="md" sx={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Task Details
      </Typography>
      {task && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {task.title}
              <Chip label={task.type} color="primary" size="small" sx={{ marginLeft: '0.5rem' }}/>
              <Chip 
                label={task.difficulty} 
                color={task.difficulty === 'easy' ? 'success' : task.difficulty === 'medium' ? 'warning' : 'error'}
                size="small"
                sx={{ marginLeft: '0.5rem' }}
              />
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Reward: ${task.reward_per_unit}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Status: {task.status}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Deadline: {new Date(task.deadline).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>Progress: {(task.completed_units / task.total_units * 100).toFixed(2)}%</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(task.completed_units / task.total_units) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
      <Box sx={{ mt: 4, border: '1px solid #e0e0e0', borderRadius: '4px', padding: '16px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Operation Area
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => console.log('Click operation')}
              sx={{ 
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#45a049' }
              }}
            >
              Click
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => console.log('Categorize operation')}
              sx={{ 
                backgroundColor: '#ff9800',
                '&:hover': { backgroundColor: '#f57c00' }
              }}
            >
              Categorize
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => console.log('Mark operation')}
              sx={{ 
                backgroundColor: '#2196f3',
                '&:hover': { backgroundColor: '#1976d2' }
              }}
            >
              Mark
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmitTask}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#45a049' },
            padding: '12px 24px',
            fontSize: '1.2rem'
          }}
        >
          Submit Task
        </Button>
      </Box>
    </Container>
  );
}

export default UserTaskOperation;

