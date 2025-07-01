import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AssignmentForm = ({
  file,
  setFile,
  textAnswer,
  setTextAnswer,
  onSubmit,
  courses,
  selectedCourseId,
  setSelectedCourseId
}) => (
  <Box>
    <Typography variant="h6">Submit Assignment</Typography>

    {/* Course Dropdown */}
    <FormControl fullWidth sx={{ my: 2 }}>
      <InputLabel id="course-select-label">Select Course</InputLabel>
      <Select
        labelId="course-select-label"
        value={selectedCourseId}
        label="Select Course"
        onChange={(e) => setSelectedCourseId(e.target.value)}
        required
      >
        {courses.map((course) => (
          <MenuItem key={course.id} value={course.id}>
            {course.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Text Answer Input */}
    <TextField
      label="Text Answer"
      multiline
      fullWidth
      rows={4}
      value={textAnswer}
      onChange={(e) => setTextAnswer(e.target.value)}
      sx={{ my: 2 }}
    />

    {/* File Upload */}
    <input type="file" onChange={(e) => setFile(e.target.files[0])} />

    {/* Submit Button */}
    <Button onClick={onSubmit} variant="contained" sx={{ mt: 2 }}>
      Submit
    </Button>
  </Box>
);

export default AssignmentForm;

