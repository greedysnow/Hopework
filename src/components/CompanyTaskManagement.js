import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Paper, Button, LinearProgress, Typography, Container, Box, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Chip
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useNavigate } from 'react-router-dom';

function CompanyTaskManagement() {
  const navigate = useNavigate();

  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskType, setNewTaskType] = useState('');
  const [newTaskTotalItems, setNewTaskTotalItems] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskResources, setResources] = useState([]);
  const [taskVisibility, setTaskVisibility] = useState('');
  const [specificUsers, setSpecificUsers] = useState('');
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://hopeworkapi.azurewebsites.net/api/task/list');
      if (!response.ok) {
        throw new Error('Failed to fetch task list');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching task list:', error);
      // Mock data
      const mockTasks = [
        { id: 1, title: 'Image Classification', type: 'Image', status: "pending", difficulty: 'Easy', reward_per_unit: 10, deadline: '2023-12-31', total_units: 100, completed_units: 10, description: 'Classify images by identifying the main objects or scenes within them.' },
        { id: 2, title: 'Text Translation', type: 'Text', status: "Available", difficulty: 'Medium', reward_per_unit: 20, deadline: '2023-12-31', total_units: 100, completed_units: 15, description: 'Translate given text from one language to another while preserving the original meaning.' },
        { id: 3, title: 'Data Entry', type: 'Data', status: "pending", difficulty: 'Easy', reward_per_unit: 15, deadline: '2023-12-31', total_units: 30, completed_units: 30, description: 'Accurately input provided information into specified databases or spreadsheets.' },
        { id: 4, title: 'Audio Transcription', type: 'Audio', status: "pending", difficulty: 'Hard', reward_per_unit: 30, deadline: '2023-12-31', total_units: 100, completed_units: 41, description: 'Transcribe audio files into text, including speaker identification and timestamps.' },
        { id: 5, title: 'Sentiment Analysis', type: 'Text', status: "Available", difficulty: 'Medium', reward_per_unit: 25, deadline: '2023-12-31', total_units: 100, completed_units: 20, description: 'Analyze text content to determine its sentiment (positive, negative, or neutral).' },
        { id: 6, title: 'Video Annotation', type: 'Video', status: "pending", difficulty: 'Hard', reward_per_unit: 35, deadline: '2023-12-31', total_units: 10, completed_units: 5, description: 'Add annotations to videos, including object tagging, action descriptions, and scene classification.' },
        { id: 7, title: 'Speech Recognition', type: 'Audio', status: "Available", difficulty: 'Medium', reward_per_unit: 28, deadline: '2023-12-31', total_units: 40, completed_units: 20, description: 'Convert speech to text, recognizing different accents and dialects.' },
        { id: 8, title: 'Image Segmentation', type: 'Image', status: "pending", difficulty: 'Hard', reward_per_unit: 40, deadline: '2023-12-31', total_units: 100, completed_units: 0, description: 'Segment images into multiple semantic regions, precisely labeling each pixel.' },
      ];
      setTasks(mockTasks);
    }
  };

  const handleViewTask = (id) => {
    navigate(`/company/task/${id}`);
  };

  const handlePauseTask = (id) => {
    // Send a request to pause the task
    fetch(`https://hopeworkapi.azurewebsites.net/api/task/${id}/pause`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Task paused:', data);
      fetchTasks();
    })
    .catch(error => {
      console.error('Error pausing task:', error);
      alert('Failed to pause task. Please try again.');
    });
  };

  const handleCancelTask = (id) => {
    // Send a request to cancel the task
    fetch(`https://hopeworkapi.azurewebsites.net/api/task/${id}/cancel`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Task cancelled:', data);
      fetchTasks();
    })
    .catch(error => {
      console.error('Error cancelling task:', error);
      alert('Failed to cancel task. Please try again.');
    });
  };

  const handleCreateTask = () => {
    // Send a request to create a new task
    fetch('https://hopeworkapi.azurewebsites.net/api/task/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        title: newTaskTitle,
        description: newTaskDescription,
        type: newTaskType, 
        total_units: newTaskTotalItems, 
        reward_per_unit: newTaskReward, 
        deadline: newTaskDeadline,
        difficulty: newTaskDifficulty,
        resources: newTaskResources,
        taskVisibility: taskVisibility,
        specificUsers: specificUsers
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Task created:', data);
      fetchTasks();
    })
    .catch(error => {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleBulkUpload = () => {
    // Send a request for bulk task upload
    const formData = new FormData();
    formData.append('file', selectedFile);
    fetch('https://hopeworkapi.azurewebsites.net/api/task/batch-upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Bulk task upload successful:', data);
      fetchTasks();
    })
    .catch(error => {
      console.error('Error during bulk task upload:', error);
      alert('Bulk upload of tasks failed, please try again');
    });
  };

  const handleOpenCreateTaskDialog = () => {
    setOpenCreateTaskDialog(true);
  };

  const handleCloseCreateTaskDialog = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskType('');
    setNewTaskTotalItems('');
    setNewTaskDifficulty('');
    setNewTaskReward('');
    setNewTaskDeadline(new Date().toISOString().slice(0, 10));
    setTaskVisibility('');
    setSpecificUsers('');
    setOpenCreateTaskDialog(false);
  };

  const handleOpenBulkUploadDialog = () => {
    setOpenBulkUploadDialog(true);
  };

  const handleCloseBulkUploadDialog = () => {
    setSelectedFile(null);
    setOpenBulkUploadDialog(false);
  };

  return (
    <Container sx={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Task Management</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenCreateTaskDialog}
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#45a049',
            },
            borderRadius: '20px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {window.innerWidth <= 600 ? "Create new" : "Create New Task"}
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleOpenBulkUploadDialog}
          startIcon={<CloudUploadIcon />}
          sx={{
            backgroundColor: '#FF9800',
            '&:hover': {
              backgroundColor: '#F57C00',
            },
            borderRadius: '20px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {window.innerWidth <= 600 ? "Bulk Upload" : "Bulk Upload Tasks"}
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: '2rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Task Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow 
                key={task.id}
                sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
              >
                <TableCell sx={{ fontSize: '0.9rem' }}>{task.title}</TableCell>
                <TableCell>
                  <Chip 
                    label={task.status} 
                    color={
                      task.status === 'completed' ? 'success' :
                      task.status === 'in_progress' ? 'primary' :
                      task.status === 'completed' ? 'default' :
                      'warning'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ width: '30%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(task.completed_units / task.total_units) * 100} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {`${Math.round((task.completed_units / task.total_units) * 100)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Button 
                      size="small"
                      color="primary"
                      onClick={() => handleViewTask(task.id)}
                      sx={{ width: { xs: '100%', sm: 'auto' }, borderRadius: '20px' }}
                    >
                      View
                    </Button>
                    <Button 
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => handlePauseTask(task.id)}
                      sx={{ width: { xs: '100%', sm: 'auto' }, borderRadius: '20px' }}
                    >
                      Pause
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelTask(task.id)}
                      sx={{ width: { xs: '100%', sm: 'auto' }, borderRadius: '20px' }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openCreateTaskDialog} onClose={handleCloseCreateTaskDialog}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent sx={{ '& .MuiTextField-root': { marginBottom: 0 } }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Task Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="description"
            label="Task Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            sx={{ mt: 2 }}
            required
          />
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }} required>
            <InputLabel>Task Type</InputLabel>
            <Select
              value={newTaskType}
              onChange={(e) => setNewTaskType(e.target.value)}
              label="Task Type"
            >
              <MenuItem value="image_labeling">Image</MenuItem>
              <MenuItem value="content_moderation">Content</MenuItem>
              <MenuItem value="data_entry">Data</MenuItem>
              <MenuItem value="translation">Translation</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="taskTotalItems"
            label="Task Total Items"
            type="number"
            fullWidth
            variant="outlined"
            value={newTaskTotalItems}
            onChange={(e) => setNewTaskTotalItems(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              inputProps: { min: 1 }
            }}
            required
          />
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }} required>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={newTaskDifficulty}
              onChange={(e) => setNewTaskDifficulty(e.target.value)}
              label="Difficulty"
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="reward"
            label="Reward"
            type="number"
            fullWidth
            variant="outlined"
            value={newTaskReward}
            onChange={(e) => setNewTaskReward(e.target.value)}
            sx={{ mt: 2 }}
            required
          />
        <TextField
          margin="dense"
          id="deadline"
          label="Deadline"
          type="date"
          fullWidth
          variant="outlined"
          value={newTaskDeadline || new Date().toISOString().slice(0, 16)}
          onChange={(e) => setNewTaskDeadline(e.target.value)}
          sx={{ mt: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          id="resources"
          label="Resource Links"
          type="text"
          fullWidth
          variant="outlined"
          required
          value={newTaskResources.join(', ')}
          onChange={(e) => setResources(e.target.value.split(',').map(link => link.trim()))}
          sx={{ mt: 2 }}
          helperText="Separate multiple links with commas"
        />
        <FormControl fullWidth sx={{ mt: 2 }} required>
          <InputLabel id="task-visibility-label">Task Visibility</InputLabel>
          <Select
            labelId="task-visibility-label"
            id="task-visibility"
            value={taskVisibility}
            label="Task Visibility"
            onChange={(e) => setTaskVisibility(e.target.value)}
          >
            <MenuItem value="public">Public Task</MenuItem>
            <MenuItem value="specific">Specific Users</MenuItem>
          </Select>
        </FormControl>
        {taskVisibility === 'specific' && (
          <TextField
            margin="dense"
            id="specificUsers"
            label="Specific Users (separate multiple user IDs with commas)"
            type="text"
            fullWidth
            variant="outlined"
            value={specificUsers}
            onChange={(e) => setSpecificUsers(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseCreateTaskDialog}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTask} 
            disabled={!newTaskTitle || !newTaskDescription || !newTaskType || !newTaskTotalItems || !newTaskDifficulty || !newTaskReward || newTaskResources.length === 0 || !taskVisibility}
            sx={{
              backgroundColor: '#2196F3',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1976D2',
              },
              '&:disabled': {
                backgroundColor: '#BBDEFB',
                color: '#white',
              },
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 'bold',
            }}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openBulkUploadDialog} onClose={handleCloseBulkUploadDialog}>
        <DialogTitle>Bulk Upload Tasks</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".csv, .xlsx, .xml"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="bulk-upload-input"
          />
          <label htmlFor="bulk-upload-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Choose File
            </Button>
          </label>
          {selectedFile && <Typography>{selectedFile.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkUploadDialog}>Cancel</Button>
          <Button onClick={handleBulkUpload} color="primary" disabled={!selectedFile}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CompanyTaskManagement;