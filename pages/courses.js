import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchCourses, enrollCourse, dropCourse } from '../services/api';  // Import the necessary functions
import CourseCard from '../components/CourseCard';
import CourseForm from '../components/CourseForm';
import CourseEnrollment from '../components/CourseEnrollment';
import UploadSyllabus from '../components/UploadSyllabus';
import { Box, Snackbar, Alert } from '@mui/material';

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
    const [enrollments, setEnrollments] = useState([]); // State for tracking student enrollments
    const [studentId, setStudentId] = useState(''); // Store current student's ID
    const [snackbarOpen, setSnackbarOpen] = useState(false);  // State for Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/'); // Redirect to login if no token exists
        } else {
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                    const decodedPayload = JSON.parse(atob(base64Url));
                    setRole(decodedPayload.role.toLowerCase()); // Extract role from token and set it
                    setStudentId(decodedPayload.userId); // Get the student ID from the token payload
                } else {
                    console.error('Invalid JWT token format');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                router.push('/');
            }
        }

        // Fetch courses from the API using fetchCourses from api.js
        const loadCourses = async () => {
            try {
                const coursesData = await fetchCourses();  // Use the imported fetchCourses function
                setCourses(Array.isArray(coursesData?.data) ? coursesData?.data : []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        loadCourses();  // Call the function to load courses
    }, [router]);


    const handleEnroll = async (courseId) => {
        try {
            // Enroll the student in the course by calling enrollCourse API
            await enrollCourse(courseId, studentId);
            setEnrollments((prevEnrollments) => [...prevEnrollments, courseId]); // Add courseId to enrollments
            setSnackbarMessage('Enrolled in course successfully');
            setSnackbarOpen(true);  // Open snackbar with success message
        } catch (error) {
            console.error('Error enrolling in course:', error);
            setSnackbarMessage('Failed to enroll in the course. Please try again.');
            setSnackbarOpen(true);  // Open snackbar with error message
        }
    };

    const handleDrop = async (courseId) => {
        try {
            // Drop the student from the course by calling dropCourse API
            await dropCourse(courseId, studentId);
            setEnrollments((prevEnrollments) => prevEnrollments.filter((id) => id !== courseId)); // Remove courseId from enrollments
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

    const checkIfEnrolled = (course) => {
        const enrollment = course?.enrollments?.find(
            (enrollment) => enrollment.student.id === studentId
        );

        // Check if enrollment exists and the status is either 'true' or 'pending'
        return enrollment ? (enrollment.status === 'true' || enrollment.status === 'pending') : false;
    };


    if (role === 'student') {
        return (
            <div>
                <ManageCoursesHeader />
                <div>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            role={role}
                            handleEnroll={handleEnroll}
                            handleDrop={handleDrop}
                            studentId={studentId} // Pass the student ID to CourseCard
                            isEnrolled={checkIfEnrolled(course)} // Pass the enrollment status
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
            </div>
        );
    } else if (role === 'lecturer') {
        return (
            <div>
                <ManageCoursesHeader />
                <CourseForm />
                <div>
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} role={role} />
                    ))}
                </div>
                <UploadSyllabus />
            </div>
        );
    } else if (role === 'admin') {
        return (
            <div>
                <ManageCoursesHeader />
                <div>
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} role={role} enrollments={enrollments} />
                    ))}
                </div>
                <CourseEnrollment />
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Courses;
