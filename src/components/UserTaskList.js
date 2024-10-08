import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, TextField, Select, MenuItem, FormControl, 
  InputLabel, Grid, Card, CardContent, Chip, InputAdornment, Box, Paper
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

function UserTaskList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState(null);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://hopeworkapi.azurewebsites.net/api/task/browse');
      if (!response.ok) {
        throw new Error('Failed to fetch task list');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        // Add mock task data
        const mockTasks = [
          {
            id: 1,
            title: 'Image Classification Task',
            type: 'Image Processing',
            difficulty: 'easy',
            status: 'In Progress',
            description: 'Classify and label a set of images',
            reward_per_unit: 5,
            total_units: 100,
            completed_units: 0,
            deadline: '2023-07-31'
          },
          {
            id: 2,
            title: 'Text Translation Task',
            type: 'Language Processing',
            difficulty: 'medium',
            status: 'Not Started',
            description: 'Translate English documents to Chinese',
            reward_per_unit: 10,
            total_units: 50,
            completed_units: 0,
            deadline: '2023-08-15'
          },
          {
            id: 3,
            title: 'Data Annotation Task',
            type: 'Data Processing',
            difficulty: 'hard',
            status: 'In Progress',
            description: 'Annotate training data for machine learning models',
            reward_per_unit: 15,
            total_units: 200,
            completed_units: 50,
            deadline: '2023-09-30'
          },
          {
            id: 4,
            title: 'Audio Transcription Task',
            type: 'Speech Processing',
            difficulty: 'medium',
            status: 'Not Started',
            description: 'Transcribe audio files into text',
            reward_per_unit: 8,
            total_units: 75,
            completed_units: 0,
            deadline: '2023-08-31'
          },
          {
            id: 5,
            title: 'Sentiment Analysis Task',
            type: 'Natural Language Processing',
            difficulty: 'hard',
            status: 'In Progress',
            description: 'Analyze sentiment of social media comments',
            reward_per_unit: 12,
            total_units: 150,
            completed_units: 30,
            deadline: '2023-09-15'
          }
        ];
        setTasks(mockTasks);
        // mock end
        // setError(true);
        return;
      }
      setTasks(data);
    } catch (error) {
      console.error('Error fetching task list:', error);
    }
  };

  const handleApplyTask = (id) => {
    fetch(`https://hopeworkapi.azurewebsites.net/api/task/${id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      alert('Application successful');
      console.log('Task apply:', data);
      navigate('/user/my-tasks');
    })
    .catch(error => {
      console.error('Error apply task:', error);
      alert('Failed to apply task. Please try again.');
    });
  };

  const handleViewTask = (id) => {
    navigate(`/user/task/${id}`);
  };

  const filteredTasks = tasks && tasks.length > 0 && tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === '' || task.type === filterType) &&
    (filterDifficulty === '' || task.difficulty === filterDifficulty) &&
    (filterStatus === '' || task.status === filterStatus)
  );

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#FFF9F9', border: '1px solid #FF6B6B', borderRadius: '8px' }}>
          <Typography variant="h5" gutterBottom color="error" sx={{ fontWeight: 'bold', mb: 2 }}>
            Oops, something went wrong!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're sorry, but we couldn't fetch the task list. Please try again later.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
            sx={{
              mt: 2,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              borderRadius: '20px',
              padding: '8px 24px',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
            }}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Available Tasks
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Search Tasks"
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Filter by Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Image">Image</MenuItem>
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="Data">Data</MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Filter by Difficulty</InputLabel>
            <Select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              label="Filter by Difficulty"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {filteredTasks && filteredTasks.length > 0 && filteredTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography
                  variant="h6"
                  component="div"
                  noWrap
                  onClick={() => handleViewTask(task.id)}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Type: {task.type}
                  </Typography>
                  <Chip 
                    label={task.difficulty} 
                    color={task.difficulty === 'easy' ? 'success' : task.difficulty === 'medium' ? 'warning' : 'error'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" component="p" sx={{ mb: 0.5 }}>
                  Reward: ${task.reward_per_unit}
                </Typography>
                <Typography variant="body2" component="p" sx={{ mb: 0.5 }}>
                  Status: {task.status}
                  {/* {
                    task.completed_units === 0 ? 'Not Started' :
                    task.completed_units === task.total_units ? 'Completed' : 'In Progress'
                  } */}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleApplyTask(task.id)}
                  sx={{ 
                    borderRadius: '20px', 
                    textTransform: 'none',
                    width: '100%',
                    mb: 1
                  }}
                >
                  Apply for this task
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default UserTaskList;