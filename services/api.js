// services/api.js

import axios from 'axios';

// Create a reusable axios instance with baseURL
export const api = axios.create({
    baseURL: 'http://localhost:3705', // Adjust based on your backend API
});



api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
        config.headers['token'] = token; // Add the token as 'token' header (matching backend)
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Fetch all users (Lecturers will be filtered)
export const fetchLecturers = async () => {
    try {
        const response = await api.get('/users'); // Make API request to fetch users
        const lecturers = response.data.data.filter(user => user.role.name === 'lecturer'); // Filter users by role
        return lecturers.map(lecturer => ({
            id: lecturer.id,  // Return the lecturer's id and name for the dropdown
            name: lecturer.name,
        }));
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        throw error;  // Rethrow the error so that it can be handled in the component
    }
};

export const fetchStudents = async () => {
    try {
        const response = await api.get('/users'); // Make API request to fetch users
        const students = response.data.data.filter(user => user.role.name === 'student'); // Filter users by role
        return students.map(student => ({
            id: student.id,  // Return the lecturer's id and name for the dropdown
            name: student.name,
        }));
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        throw error;  // Rethrow the error so that it can be handled in the component
    }
};

// Fetch all courses
export const fetchCourses = async () => {
    try {
        const response = await api.get('/courses');
        return response?.data;
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        throw error;  // Rethrow the error so that it can be handled in the component
    }
};

// Create a new course
export const createCourse = async (courseData) => {
    try {
        const response = await api.post('/courses/create', courseData);
        return response.data;
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        throw error;  // Rethrow the error so that it can be handled in the component
    }
};

export const updateSyllabus = async (courseData) => {
    try {
        const response = await api.post('/courses/update/syllabus', courseData);
        return response.data;
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        throw error;  // Rethrow the error so that it can be handled in the component
    }
};


// Enroll in a course
export const enrollCourse = async (courseId, studentId) => {
  try {
    const response = await api.post('/courses/enroll', { courseId, studentId });
    return response.data; // Assuming the backend responds with success message/data
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

// Drop a course
export const dropCourse = async (courseId, studentId) => {
  try {
    const response = await api.post('/courses/drop', { courseId, studentId });
    return response.data; // Assuming the backend responds with success message/data
  } catch (error) {
    console.error('Error dropping course:', error);
    throw error;
  }
};
