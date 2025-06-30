// components/DashboardStudent.js

import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardStudent = () => {
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
      <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to your student dashboard.
      </Typography>
      <Typography variant="body2" paragraph>
        Here you can view your courses, grades, and assignments.
      </Typography>
      {/* Add more student-specific content here */}
    </Box>
  );
};

export default DashboardStudent;
