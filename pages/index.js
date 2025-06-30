// pages/login.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Box, Container, Alert, CircularProgress } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');  // Email input for the user
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error before the next request

    try {
      // Sending 'email' as 'username' to the backend API
      const response = await axios.post('http://localhost:3705/users/login', { username: email, password });
      localStorage.setItem('token', response.data.data.token);  // Save token to localStorage
      router.push('/dashboard');  // Redirect to dashboard after login
    } catch (err) {
      // Handle error response from the API
      if (err.response && err.response.data) {
        setError(err.response.data.message); // Display error message
      } else {
        setError('An error occurred. Please try again.'); // Generic error message if no response
      }
      setLoading(false);  // Stop loading spinner after error
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>Login</Typography>

        {/* Display error message */}
        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            padding: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {/* Email Input (Key is 'username' in API request) */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: <Email sx={{ color: 'action.active' }} />,
            }}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: <Lock sx={{ color: 'action.active' }} />,
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: 1, fontSize: '16px', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
