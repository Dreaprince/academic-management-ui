// components/CourseEnrollment.jsx
import React from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';

const CourseEnrollment = ({
  enrollments,
  loading,
  onApprove,
  onReject
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Manage Enrollments</Typography>
      <Typography variant="body1" gutterBottom>
        Here you can approve or reject student enrollments.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : enrollments.length > 0 ? (
        enrollments.map((enrollment) => (
          <Box
            key={enrollment.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
              padding: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
              flexDirection: 'row',
            }}
          >
            <Box sx={{ flex: 1, marginRight: "40px" }}>
              <Typography variant="body1">
                {enrollment.student.name} - {enrollment.course.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {enrollment.status}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => onApprove(enrollment.id)}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => onReject(enrollment.id)}
              >
                Reject
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No enrollments awaiting approval</Typography>
      )}
    </Box>
  );
};

export default CourseEnrollment;
