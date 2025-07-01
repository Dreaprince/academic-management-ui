import { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { Home, LibraryBooks, ExitToApp } from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  const [userName, setUserName] = useState('Guest');
  const [userRole, setUserRole] = useState('Visitor');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('userName');
      const role = localStorage.getItem('roleName');

      setUserName(user || 'Guest');
      setUserRole(role || 'Visitor');
    }
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          position: 'relative',
          borderRight: '1px solid #ddd',
        },
      }}
    >
      <div style={{ padding: '20px' }}>
        {/* Display User Info */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">{userName}</Typography>
          <Typography variant="body2" color="textSecondary">{userRole}</Typography>
        </Box>

        <List>
          <ListItem button onClick={() => handleNavigation('/dashboard')}>
            <Home />
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/courses')}>
            <LibraryBooks />
            <ListItemText primary="Courses" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/assignments')}>
            <LibraryBooks />
            <ListItemText primary="Assignments" />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ExitToApp />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
