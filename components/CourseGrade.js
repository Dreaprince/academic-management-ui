import { Box, Typography } from '@mui/material';

const CourseGrade = ({ gradeSummary }) => {
  if (!gradeSummary) return null;

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6">Grade Summary</Typography>
      <Typography>Final Grade: {gradeSummary.finalGrade}%</Typography>
      <Typography>Details: {gradeSummary.weightedBreakdown}</Typography>
    </Box>
  );
};

export default CourseGrade;
