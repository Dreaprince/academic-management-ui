import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

const GradeAssignment = ({ submissionId, onGrade }) => {
  const [score, setScore] = useState('');

  return (
    <Box sx={{ mt: 1 }}>
      <TextField
        label="Score"
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button onClick={() => onGrade(score)} variant="contained">Grade</Button>
    </Box>
  );
};

export default GradeAssignment;
