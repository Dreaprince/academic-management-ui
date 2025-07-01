import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AssignmentForm from '../components/AssignmentForm';
import GradeAssignment from '../components/GradeAssignment';
import CourseGrade from '../components/CourseGrade';
import {
  api,
  fetchCourses,
  fetchAssignments as getAssignments,
  fetchGradeSummary as getGradeSummary,
} from '../services/api';

const AssignmentsPage = () => {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [gradeSummary, setGradeSummary] = useState(null);
  const [file, setFile] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [role, setRole] = useState('');
  const [studentId, setStudentId] = useState('');
  const [courseId, setSelectedCourseId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [uploadError, setUploadError] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Decode token and set role + studentId
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        router.push('/');
        return;
      }

      try {
        const parts = storedToken.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const decodedPayload = JSON.parse(atob(base64Url));
          setRole(decodedPayload.role.toLowerCase());
          setStudentId(decodedPayload.userId);
        } else {
          console.error('Invalid JWT format');
          router.push('/');
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
        router.push('/');
      }
    }
  }, [router]);

  // Fetch course list
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetchCourses();
        setCourses(response?.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setUploadError('Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourseData();
  }, []);

  // Fetch assignments and gradess
  // useEffect(() => {
  //   if (!courseId) return;
  //   fetchAssignments();
  //   if (role === 'student') fetchGradeSummary();
  // }, [courseId, role]);

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments(courseId);
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to fetch assignments', 'error');
    }
  };

  const fetchGradeSummary = async () => {
    try {
      const res = await getGradeSummary(studentId);
      setGradeSummary(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignmentSubmit = async () => {
    if (!courseId) {
      showSnackbar('Please select a course first', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('courseId', courseId);
    formData.append('text', textAnswer);
    if (file) formData.append('file', file);

    try {
      await api.post('/assignments/create', formData);
      showSnackbar('Assignment submitted', 'success');
      // fetchAssignments();
      // fetchGradeSummary();
      setFile(null);
      setTextAnswer('');
    } catch (err) {
      console.error(err);
      showSnackbar('Submission failed', 'error');
    }
  };

  const handleGrade = async (submissionId, score) => {
    try {
      await axios.put(`/api/assignments/${submissionId}/grade`, { score });
      showSnackbar('Graded successfully', 'success');
      //fetchAssignments();
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to grade', 'error');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>Assignments</Typography>

      {role === 'student' && (
        <>
          <AssignmentForm
            file={file}
            setFile={setFile}
            textAnswer={textAnswer}
            setTextAnswer={setTextAnswer}
            onSubmit={handleAssignmentSubmit}
            courses={courses}
            selectedCourseId={courseId}
            setSelectedCourseId={setSelectedCourseId}
          />
          <CourseGrade gradeSummary={gradeSummary} />
        </>
      )}

      {role === 'lecturer' && assignments.map((a) => (
        <Box key={a.id} sx={{ border: '1px solid #ccc', p: 2, my: 2 }}>
          <Typography>{a.student.name} submitted: {a.text || a.fileName}</Typography>
          <Typography>Status: {a.score != null ? `Graded (${a.score})` : 'Pending'}</Typography>
          {a.score == null && (
            <GradeAssignment
              submissionId={a.id}
              onGrade={(score) => handleGrade(a.id, score)}
            />
          )}
        </Box>
      ))}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
};

export default AssignmentsPage;
