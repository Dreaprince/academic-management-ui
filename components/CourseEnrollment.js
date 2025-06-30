import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { fetchEnrollments, approveEnrollment } from '../services/api'; // Import necessary functions

const CourseEnrollment = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const loadEnrollments = async () => {
            try {
                const enrollmentData = await fetchEnrollments(); // Fetch pending enrollments
                setEnrollments(enrollmentData?.data?.filter((enrollment) => enrollment.status === 'pending'));
            } catch (error) {
                console.error('Error fetching enrollments:', error);
                setSnackbarMessage('Failed to load enrollments');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        loadEnrollments();
    }, []);

    const handleApprove = async (enrollmentId) => {
        try {
            const response = await approveEnrollment(enrollmentId, 'approved'); // Pass 'true' as status for approval
            setSnackbarMessage('Enrollment approved successfully');
            setSnackbarOpen(true);

            // Update the enrollments list by changing the status of the corresponding enrollment
            const updatedEnrollments = await fetchEnrollments();  // Re-fetch enrollments after approval
            setEnrollments(updatedEnrollments); // Update state with the newly fetched enrollments
        } catch (error) {
            console.error('Error approving enrollment:', error);
            setSnackbarMessage('Failed to approve enrollment');
            setSnackbarOpen(true);
        }
    };

    const handleReject = async (enrollmentId) => {
        try {
            // Call API to reject the enrollment
            const response = await approveEnrollment(enrollmentId, 'rejected'); // Pass 'false' as status for rejection
            setSnackbarMessage('Enrollment rejected successfully');
            setSnackbarOpen(true);

            // Update the enrollments list by changing the status of the corresponding enrollment
            const updatedEnrollments = await fetchEnrollments();  // Re-fetch enrollments after rejection
            setEnrollments(updatedEnrollments); // Update state with the newly fetched enrollments
        } catch (error) {
            console.error('Error rejecting enrollment:', error);
            setSnackbarMessage('Failed to reject enrollment');
            setSnackbarOpen(true);
        }
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Typography variant="h5" gutterBottom>Manage Enrollments</Typography>
            <Typography variant="body1" gutterBottom>Here you can approve or reject student enrollments.</Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <div>
                    {enrollments.length > 0 ? (
                        enrollments.map((enrollment) => (
                            <Box
                                key={enrollment.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 2,
                                    padding: 2,
                                    border: '1px solid #ddd',
                                    borderRadius: 2,
                                    flexDirection: 'row', // Ensure both parts are horizontally aligned
                                }}
                            >
                                {/* Left side: Display student name and course title */}
                                <Box sx={{ flex: 1, marginRight: "40px" }}>
                                    <Typography variant="body1">{enrollment.student.name} - {enrollment.course.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">Status: {enrollment.status}</Typography>
                                </Box>

                                {/* Right side: Buttons for approval and rejection */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleApprove(enrollment.id)}
                                        sx={{ padding: '6px 16px' }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleReject(enrollment.id)}
                                        sx={{ padding: '6px 16px' }}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            </Box>

                        ))
                    ) : (
                        <Typography>No enrollments awaiting approval</Typography>
                    )}
                </div>
            )}

            {/* Snackbar for success or error message */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}  // Snackbar will hide after 6 seconds
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CourseEnrollment;
