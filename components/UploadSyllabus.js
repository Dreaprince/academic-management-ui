import { useState, useEffect } from 'react';
import { Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, CircularProgress } from '@mui/material';
import axios from 'axios';
import { createCourse, fetchCourses, updateSyllabus } from '../services/api'; // Ensure you are using the correct import for fetchCourses

const UploadSyllabus = () => {
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true); // Loading state for courses
  const [error, setError] = useState('');

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetchCourses(); // Call to fetchCourses function
        setCourses(response?.data); // Assuming response contains an array of courses
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourseData(); // Fetch courses on mount
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCourseChange = (e) => {
    setCourseId(e.target.value); // Set selected courseId
  };

  const handleUpload = async () => {
    if (!file || !courseId) {
      setError('Please select a course and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId); // Add courseId to the form data

    try {
      await updateSyllabus(formData);  // Ensure this endpoint is correct
      alert('Syllabus uploaded successfully');
    } catch (error) {
      console.error('Error uploading syllabus:', error);
      setError('Error uploading syllabus. Please try again.');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="30vh" // Ensures it takes up full viewport height
      flexDirection="column"
    >
      <Typography variant="h6" gutterBottom>Upload Syllabus</Typography>
      
      {/* Display error message if any */}
      {error && <Typography color="error" variant="body2">{error}</Typography>}

      {/* Course Dropdown */}
      <FormControl fullWidth sx={{ marginBottom: 2, maxWidth: 300 }}>
        <InputLabel id="course-select-label">Select Course</InputLabel>
        <Select
          labelId="course-select-label"
          id="course-select"
          value={courseId}
          onChange={handleCourseChange}
          label="Select Course"
          required
        >
          {loadingCourses ? (
            <MenuItem value="">
              <CircularProgress size={24} color="inherit" />
            </MenuItem>
          ) : (
            courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title} {/* Assuming each course has a title */}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* File Input */}
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />

      <Typography variant="body2" color="textSecondary">
        {file ? `Selected file: ${file.name}` : 'No syllabus uploaded'}
      </Typography>

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        variant="contained"
        sx={{ marginTop: '10px' }}
      >
        Upload
      </Button>
    </Box>
  );
};

export default UploadSyllabus;
