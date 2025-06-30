// components/CourseCard.js

import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';

const CourseCard = ({ course }) => {
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

        {/* <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
  
          <Button size="small" variant="contained" color="primary">
            Enroll
          </Button>
        </CardActions> */}
      </Card>
    </Box>
  );
};

export default CourseCard;

