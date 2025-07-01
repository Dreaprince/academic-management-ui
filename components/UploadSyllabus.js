// components/UploadSyllabus.js
import { Box, Typography, MenuItem, FormControl, InputLabel, Select, Button, CircularProgress } from '@mui/material';

const UploadSyllabus = ({
  file,
  setFile,
  courseId,
  setCourseId,
  courses,
  loadingCourses,
  error,
  handleUpload
}) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh" flexDirection="column">
      <Typography variant="h6" gutterBottom>Upload Syllabus</Typography>
      
      {error && <Typography color="error" variant="body2">{error}</Typography>}

      <FormControl fullWidth sx={{ marginBottom: 2, maxWidth: 300 }}>
        <InputLabel id="course-select-label">Select Course</InputLabel>
        <Select
          labelId="course-select-label"
          id="course-select"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
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
                {course.title}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: 16 }}
      />

      <Typography variant="body2" color="textSecondary">
        {file ? `Selected file: ${file.name}` : 'No syllabus uploaded'}
      </Typography>

      <Button onClick={handleUpload} variant="contained" sx={{ marginTop: '10px' }}>
        Upload
      </Button>
    </Box>
  );
};

export default UploadSyllabus;
