
import { Box, Typography } from '@mui/material';

const DashboardLecturer = () => {
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
      <Typography variant="h4" gutterBottom>Lecturer Dashboard</Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to your lecturer dashboard.
      </Typography>
      <Typography variant="body2" paragraph>
        Here you can create and manage courses, grade assignments, and more.
      </Typography>
      {/* Add more lecturer-specific content here */}
    </Box>
  );
};

export default DashboardLecturer;

