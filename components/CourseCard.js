import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';

const CourseCard = ({ course, role, enrollments, handleEnroll, handleDrop }) => {
  // Check if student is enrolled in the course
  console.log("isEnrolled: ", enrollments)
  console.log("courseddddd: ", course.id)
  const isEnrolled = enrollments.includes(course.id);  // Check if course ID is in the enrollments list

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',  // Center the cards horizontally
        marginBottom: 2,  // Space between cards
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: '300px',
          boxShadow: 3,
          borderRadius: 2,
          '&:hover': {
            boxShadow: 6,  // Elevate the card on hover
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            {course.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            <strong>Instructor:</strong> {course.lecturer?.name}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          {/* Only show enroll/drop buttons for students */}
          {role === 'student' && (
            <>
              {!isEnrolled ? (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleEnroll(course.id)} // Enroll in the course
                >
                  Enroll
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDrop(course.id)} // Drop the course
                >
                  Drop
                </Button>
              )}
            </>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default CourseCard;
