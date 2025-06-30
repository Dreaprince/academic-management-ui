import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchCourses, enrollCourse, dropCourse } from '../services/api';  // Import the necessary functions
import CourseCard from '../components/CourseCard';
import CourseForm from '../components/CourseForm';
import CourseEnrollment from '../components/CourseEnrollment';
import UploadSyllabus from '../components/UploadSyllabus';
import { Box, Snackbar, Alert } from '@mui/material';
import Layout from '../components/Layout';

// Reusable Box Component for "Manage Your Courses"
const ManageCoursesHeader = () => (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh" // Ensures it takes up full viewport height
        flexDirection="column"
    >
        <h1>Manage Your Courses</h1>
    </Box>
);

const Courses = () => {


    const [courses, setCourses] = useState([]);
    const [role, setRole] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [studentId, setStudentId] = useState(''); // Store current student's ID
    const [snackbarOpen, setSnackbarOpen] = useState(false);  // State for Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isClient, setIsClient] = useState(false);


    const router = useRouter();

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


    const handleEnroll = async (courseId) => {
        try {
            const response = await enrollCourse(courseId, studentId); // Enroll the student

            // Check if enrollment was successful (statusCode === "00")
            if (response.statusCode === "00") {
                // Update the UI immediately with the new enrollment status
                setCourses((prevCourses) =>
                    prevCourses.map((course) =>
                        course.id === courseId
                            ? { ...course, isEnrolled: true } // Update `isEnrolled` to true for the enrolled course
                            : course
                    )
                );

                // Show success message in Snackbar
                setSnackbarMessage('Enrolled in course successfully');
                setSnackbarOpen(true);
            } else if (response.statusCode === "409") {
                // Handle case where the student is already enrolled
                setSnackbarMessage('You are already enrolled in this course.');
                setSnackbarOpen(true);
            } else {
                // Handle other statuses or unexpected responses
                setSnackbarMessage('Something went wrong. Please try again.');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            setSnackbarMessage('Failed to enroll in the course. Please try again.');
            setSnackbarOpen(true); // Open snackbar with error message
        }
    };


    const handleDrop = async (courseId) => {
        try {
            await dropCourse(courseId, studentId);  // Drop the student from the course
            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course.id === courseId
                        ? { ...course, isEnrolled: false } // Update isEnrolled to false immediately
                        : course
                )
            ); // Update `isEnrolled` immediately
            setSnackbarMessage('Dropped the course successfully');
            setSnackbarOpen(true);  // Open snackbar with success message
        } catch (error) {
            console.error('Error dropping course:', error);
            setSnackbarMessage('Failed to drop the course. Please try again.');
            setSnackbarOpen(true);  // Open snackbar with error message
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false); // Close the snackbar when clickeds
    };


    if (role === 'student') {
        return (
            <Layout>
                <ManageCoursesHeader />
                <div>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            role={role}
                            handleEnroll={handleEnroll}
                            handleDrop={handleDrop}
                            studentId={studentId}
                            isEnrolled={course.isEnrolled} // Directly use `isEnrolled` from state
                        />
                    ))}
                </div>

                {/* Snackbar for success or error message */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}  // Snackbar will hide after 6 seconds
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Layout>
        );
    } else if (role === 'lecturer') {
        return (
            <Layout>
                <ManageCoursesHeader />
                <CourseForm />
                <div>
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} role={role} />
                    ))}
                </div>
                <UploadSyllabus />
            </Layout>
        );
    } else if (role === 'admin') {
        return (
            <Layout>
                <ManageCoursesHeader />
                <div>
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} role={role} enrollments={enrollments} />
                    ))}
                </div>
                <CourseEnrollment />
            </Layout>
        );
    } else {
        return <Layout>Loading...</Layout>;
    }
};

export default Courses;
