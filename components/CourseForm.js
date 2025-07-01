import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { fetchLecturers, fetchStudents } from '../services/api';

const CourseForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [syllabus, setSyllabus] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLecturerData = async () => {
      try {
        const response = await fetchLecturers();
        setLecturers(response);
      } catch (err) {
        console.error('Error fetching lecturers:', err);
        setError('Failed to load lecturers');
      } finally {
        setLoadingLecturers(false);
      }
    };

    const fetchStudentData = async () => {
      try {
        const response = await fetchStudents();
        setStudents(response);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students');
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchLecturerData();
    fetchStudentData();
  }, []);

  const handleSyllabusChange = (e) => {
    const files = Array.from(e.target.files);
    setSyllabus(files.map((file) => file.name));
  };

  const resetForm = () => {
    setTitle('');
    setCredits('');
    setLecturerId('');
    setSyllabus([]);
    setEnrollments([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const numericCredits = parseInt(credits, 10);
    if (isNaN(numericCredits) || numericCredits <= 0) {
      setError('Please enter a valid number for credits');
      setLoading(false);
      return;
    }

    const courseData = {
      title,
      credits: numericCredits,
      lecturerId,
      syllabus,
      enrollments,
    };

    await onSubmit(courseData, resetForm);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        margin: '0 auto',
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create/Update Course
      </Typography>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Course Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Credits"
          variant="outlined"
          fullWidth
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="lecturer-select-label">Lecturer</InputLabel>
          <Select
            labelId="lecturer-select-label"
            value={lecturerId}
            onChange={(e) => setLecturerId(e.target.value)}
            label="Lecturer"
            required
          >
            {loadingLecturers ? (
              <MenuItem value="">
                <CircularProgress size={24} />
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="student-select-label">Enroll Students</InputLabel>
          <Select
            labelId="student-select-label"
            multiple
            value={enrollments}
            onChange={(e) => setEnrollments(e.target.value)}
            label="Enroll Students"
            renderValue={(selected) =>
              selected
                .map((id) => students.find((s) => s.id === id)?.name || '')
                .join(', ')
            }
          >
            {loadingStudents ? (
              <MenuItem value="">
                <CircularProgress size={24} />
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

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Upload Syllabus
        </Typography>
        <input
          type="file"
          multiple
          onChange={handleSyllabusChange}
          style={{ marginBottom: 16 }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {syllabus.length > 0
            ? `Files: ${syllabus.join(', ')}`
            : 'No syllabus uploaded'}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ fontWeight: 'bold', py: 1 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </form>
    </Box>
  );
};

export default CourseForm;
