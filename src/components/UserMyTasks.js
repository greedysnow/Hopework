import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Button, Chip, Paper, IconButton,
  LinearProgress, Box, Card, CardContent, CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserMyTasks() {
  const navigate = useNavigate();

  const [myTask, setMyTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch('https://hopeworkapi.azurewebsites.net/api/task/mytasks', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch task list');
        // }
        const data = await response.json();
        console.log(data)
        setMyTask(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching tasks:', err);
        // Mock data - replace with actual data fetching
        const mockTask = [
          { id: 1, title: 'Image Classification', type: 'image_labeling', status: "pending", difficulty: 'easy', reward_per_unit: 10, deadline: '2023-12-31', total_units: 100, completed_units: 10, description: 'Classify images by identifying the main objects or scenes within them.' },
          { id: 2, title: 'Text Translation', type: 'image_labeling', status: "Available", difficulty: 'medium', reward_per_unit: 20, deadline: '2023-12-31', total_units: 100, completed_units: 15, description: 'Translate given text from one language to another while preserving the original meaning.' },
          { id: 3, title: 'Data Entry', type: 'data_entry', status: "completed", difficulty: 'easy', reward_per_unit: 15, deadline: '2023-12-31', total_units: 30, completed_units: 30, description: 'Accurately input provided information into specified databases or spreadsheets.' },
          { id: 4, title: 'Audio Transcription', type: 'content_moderation', status: "pending", difficulty: 'hard', reward_per_unit: 30, deadline: '2023-12-31', total_units: 100, completed_units: 41, description: 'Transcribe audio files into text, including speaker identification and timestamps.' },
        ];
        setMyTask(mockTask);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, []);

  const handleSubmitTask = (id) => {
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

  const handleViewTaskOperation = (taskId) => {
    // Navigate to task details page based on task ID
    navigate(`/user/task-operation/${taskId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Loading my task.</Typography>
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
        My Tasks
      </Typography>
      <Grid container spacing={3}>
        {myTask.map((task) => (
          <Grid item xs={12} key={task.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Typography
                    variant="h6"
                    component="span"
                    noWrap
                    onClick={() => handleViewTaskOperation(task.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip label={task.type} color="primary" size="small" sx={{ marginLeft: '0.5rem' }}/>
                  <Chip 
                    label={task.difficulty} 
                    color={task.difficulty === 'easy' ? 'success' : task.difficulty === 'medium' ? 'warning' : 'error'}
                    size="small"
                    sx={{ marginLeft: '0.5rem' }}
                  />
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Typography variant="body2">Reward: ${task.reward_per_unit}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">Status: {task.status}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>Progress: {(task.completed_units / task.total_units) * 100}%</Typography>
                  <LinearProgress 
                      variant="determinate" 
                      value={(task.completed_units / task.total_units) * 100} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  variant="contained"
                  onClick={() => handleSubmitTask(task.id)}
                >
                  Submit Task
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default UserMyTasks;