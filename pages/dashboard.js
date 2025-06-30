import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardStudent from '../components/DashboardStudent';
import DashboardLecturer from '../components/DashboardLecturer';
import DashboardAdmin from '../components/DashboardAdmin';
import LoadingPage from '../components/LoadingPage';
import Layout from '../components/Layout';

const Dashboard = () => {
    const [role, setRole] = useState('');
    const [isClient, setIsClient] = useState(false);  // To check if it's client-side
    const router = useRouter();

    useEffect(() => {
        // Only access localStorage on the client-side
        if (typeof window !== 'undefined') {
            setIsClient(true);  // Set the flag to true once the component is mounted

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login'); // Redirect to login if no token exists
                return; // Prevent further code execution
            }

            try {
                // Check if token is in a valid JWT format (3 parts)
                const parts = token.split('.');
                if (parts.length === 3) {
                    // Replace URL-safe characters
                    const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                    const decodedPayload = JSON.parse(atob(base64Url)); // Decode only the payload
                    setRole(decodedPayload.role); // Extract the role from the decoded token
                } else {
                    console.error('Invalid JWT token format');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                router.push('/login');
            }
        }
    }, [router]);

    // Ensure the role is checked only after the component is mounted on the client
    if (!isClient) {
        return <LoadingPage />; // Show loading while we are waiting for client-side rendering
    }

    // Convert role to lowercase for case-insensitive comparison
    const roleLower = role.toLowerCase();

    // Display appropriate dashboard based on role or show loading page
    if (roleLower === 'student') {
        return (
            <Layout>
                <DashboardStudent />
            </Layout>
        );
    } else if (roleLower === 'lecturer') {
        return (
            <Layout>
                <DashboardLecturer />
            </Layout>
        );
    } else if (roleLower === 'admin') {
        return (
            <Layout>
                <DashboardAdmin/>
            </Layout>
        );
    } else {
        // If the role is invalid or not recognized, redirect to login
        router.push('/'); // Redirect to login page
        return (
            <Layout>
                <LoadingPage />
            </Layout>
        );
    }
};

export default Dashboard;
