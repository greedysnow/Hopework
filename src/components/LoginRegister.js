import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Container, ToggleButton, ToggleButtonGroup,
  Paper, Box, Avatar, CssBaseline, Link
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('user');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login or registration logic
    // Assume login or registration is successful
    if (userType === 'user') {
      navigate('/user/tasks');
    } else {
      navigate('/company/tasks');
    }
  };

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={6} sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            🔒
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? 'Sign in' : 'Register'} as a Worker
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <ToggleButtonGroup
              color="primary"
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              aria-label="User Type"
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="user" sx={{ textTransform: 'none', }}>Individual</ToggleButton>
              <ToggleButton value="company" sx={{ textTransform: 'none', }}>Company</ToggleButton>
            </ToggleButtonGroup>
            {!isLogin && userType === 'company' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="company"
                label="Company Name"
                name="company"
                autoFocus
              />
            )}
            {!isLogin && userType === 'user' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={isLogin}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {!isLogin && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                />
                {userType === 'user' && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="refugeeCampId"
                    label="Refugee Camp ID"
                    id="refugeeCampId"
                  />
                )}
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, textTransform: 'none' }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => setIsLogin(!isLogin)}
                sx={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Link>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default LoginRegister;