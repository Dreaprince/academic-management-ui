// components/DashboardAdmin.js

import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardAdmin = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full height of the viewport
        padding: 2,
        textAlign: 'center', // Center align text
        backgroundColor: '#f4f4f4',
      }}
    >
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to your admin dashboard.
      </Typography>
      <Typography variant="body2" paragraph>
        Here you can manage users, approve courses, and more.
      </Typography>
      {/* Add more admin-specific content here */}
    </Box>
  );
};

export default DashboardAdmin;
