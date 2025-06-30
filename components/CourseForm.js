// components/CourseForm.js

import { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { createCourse, fetchCourses, fetchLecturers, fetchStudents } from '../services/api'; // Import necessary functions

const CourseForm = () => {
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [syllabus, setSyllabus] = useState([]);
  const [enrollments, setEnrollments] = useState([]); // Store student IDs here
  const [lecturers, setLecturers] = useState([]); // State to store lecturers
  const [students, setStudents] = useState([]); // State to store students
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingLecturers, setLoadingLecturers] = useState(true); // Loading state for fetching lecturers
  const [loadingStudents, setLoadingStudents] = useState(true); // Loading state for fetching students

  useEffect(() => {
    // Fetch lecturers from the API
    const fetchLecturerData = async () => {
      try {
        const response = await fetchLecturers();
        setLecturers(response); // Set the filtered lecturers
      } catch (error) {
        console.error('Error fetching lecturers:', error);
        setError('Failed to load lecturers. Please try again.');
      } finally {
        setLoadingLecturers(false); // Stop loading once the lecturers are fetched
      }
    };

    // Fetch students from the API
    const fetchStudentData = async () => {
      try {
        const response = await fetchStudents();
        setStudents(response); // Set the filtered students (with only id and name)
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students. Please try again.');
      } finally {
        setLoadingStudents(false); // Stop loading once the students are fetched
      }
    };

    fetchLecturerData();
    fetchStudentData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSyllabusChange = (e) => {
    const files = Array.from(e.target.files);
    setSyllabus(files.map(file => file.name)); // Save file names or URLs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      const numericCredits = parseInt(credits, 10);  // Converts string to integer

      // Validate credits if necessary
      if (isNaN(numericCredits) || numericCredits <= 0) {
        setError('Please enter a valid number for credits');
        setLoading(false);
        return;
      }

      // Create course data using the form values
      const courseData = {
        title,
        credits: numericCredits, // Ensure credits is a number
        lecturerId,
        syllabus,
        enrollments,  // This will now contain student IDs
      };

      const newCourse = await createCourse(courseData);

      // Optionally, refresh the list of courses
      // const updatedCourses = await fetchCourses();
      // console.log('Updated Courses:', updatedCourses);  // Log or update your state if needed

      alert('Course created successfully');
      setTitle('');
      setCredits('');
      setLecturerId('');
      setSyllabus([]);
      setEnrollments([]);

      window.location.reload();
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '400px', // Set a wider max width for the form
        margin: '0 auto',
      }}
    >
      <Typography variant="h6" gutterBottom>Create/Update Course</Typography>

      {/* Display error message if any */}
      {error && <Typography color="error" variant="body2">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        {/* Course Title */}
        <TextField
          label="Course Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />

        {/* Credits */}
        <TextField
          label="Credits"
          variant="outlined"
          fullWidth
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          required
          type="number"
          sx={{ marginBottom: 2 }}
        />

        {/* Lecturer Dropdown */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="lecturer-select-label">Lecturer</InputLabel>
          <Select
            labelId="lecturer-select-label"
            id="lecturer-select"
            value={lecturerId}
            onChange={(e) => setLecturerId(e.target.value)}
            label="Lecturer"
            required
          >
            {loadingLecturers ? (
              <MenuItem value="">
                <CircularProgress size={24} color="inherit" />
              </MenuItem>
            ) : (
              lecturers.map((lecturer) => (
                <MenuItem key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Student Enrollment Dropdown */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="student-select-label">Enroll Students</InputLabel>
          <Select
            labelId="student-select-label"
            id="student-select"
            multiple
            value={enrollments}
            onChange={(e) => setEnrollments(e.target.value)}
            label="Enroll Students"
            renderValue={(selected) => {
              return selected
                .map((studentId) => {
                  const student = students.find((s) => s.id === studentId);
                  return student ? student.name : '';
                })
                .join(', ');  // Display the student names in the input
            }}
          >
            {loadingStudents ? (
              <MenuItem value="">
                <CircularProgress size={24} color="inherit" />
              </MenuItem>
            ) : (
              students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Syllabus (File Upload) */}
        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
          Upload Syllabus
        </Typography>
        <input
          type="file"
          multiple
          onChange={handleSyllabusChange}
          style={{ marginBottom: 16 }}
        />
        <Typography variant="body2" color="textSecondary">
          {syllabus.length > 0 ? `Syllabus files: ${syllabus.join(', ')}` : 'No syllabus uploaded'}
        </Typography>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ padding: 1, fontSize: '16px', fontWeight: 'bold' }}
          disabled={loading}  // Disable button while loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </form>
    </Box>
  );
};

export default CourseForm;
