// pages/dashboard.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardStudent from '../components/DashboardStudent';
import DashboardLecturer from '../components/DashboardLecturer';
import DashboardAdmin from '../components/DashboardAdmin';
import LoadingPage from '../components/LoadingPage';
import Layout from '../components/Layout';

const Dashboard = () => {

  // function getToken() {
  //   if (typeof window !== 'undefined') {
  //     let role = localStorage.getItem("token")
  //     return role
  //   }
  // }

  // const token = getToken()


  const [role, setRole] = useState('');
  const [isClient, setIsClient] = useState(false);  // To check if it's client-side
  const router = useRouter();



  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const decodedPayload = JSON.parse(atob(base64Url));
          setRole(decodedPayload.role);
        } else {
          console.error('Invalid JWT token format');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/');
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
        <DashboardAdmin />
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
