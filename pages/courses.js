// pages/courses.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchCourses } from '../services/api';  // Import the fetchCourses function
import CourseCard from '../components/CourseCard';
import CourseForm from '../components/CourseForm';
import CourseEnrollment from '../components/CourseEnrollment';
import UploadSyllabus from '../components/UploadSyllabus';
import { Box } from '@mui/material';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [role, setRole] = useState('');
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
                } else {
                    console.error('Invalid JWT token format');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                router.push('/login');
            }
        }

        // Fetch courses from the API using fetchCourses from api.js
        const loadCourses = async () => {
            try {
                const coursesData = await fetchCourses();
                //console.log("coursesData: ", coursesData?.data)
                setCourses(Array.isArray(coursesData?.data) ? coursesData?.data : []);  // Ensure it's always an array
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);  // Set an empty array in case of error
            }
        };

        loadCourses();  // Call the function to load courses
    }, [router]);

    if (role === 'student') {
        return (
            <div>
                <h1>Available Courses</h1>
                <div>
                    {Array.isArray(courses) && courses.length ? (
                        courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <p>No courses available</p>  // Fallback if no courses exist
                    )}
                </div>
            </div>
        );
    } else if (role === 'lecturer') {
        return (
            <div>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="10vh" // Ensures it takes up full viewport height
                    flexDirection="column"
                >
                    <h1>Manage Your Courses</h1>
                </Box>
                <CourseForm />
                <div>
                    {Array.isArray(courses) && courses.length ? (
                        courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <p>No courses available</p>
                    )}
                </div>
                <UploadSyllabus />
            </div>
        );
    } else if (role === 'admin') {
        return (
            <div>
                <h1>Admin - Course Management</h1>
                <div>
                    {Array.isArray(courses) && courses.length ? (
                        courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <p>No courses available</p>
                    )}
                </div>
                <CourseEnrollment />
            </div>
        );
    } else {
        return <div>Loading...</div>;
    }
};

export default Courses;
