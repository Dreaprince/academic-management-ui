import { Drawer, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { Home, LibraryBooks, ExitToApp } from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();

  // Retrieve user info from localStorage (assuming the token is stored there)
  const user = localStorage.getItem('userName'); 
  const role = localStorage.getItem('roleName');

  const userName = user || 'Guest'; // Default to 'Guest' if no user info is found
  const userRole = role || 'Visitor'; // Default to 'Visitor' if no role info is found

  const handleNavigation = (path) => {
    router.push(path); // Navigate to the selected page
  };

  const handleLogout = () => {
    // Clear token and user details from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
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
