// components/Layout.js
import Sidebar from './Sidebar'; // Import Sidebar correctly

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Permanent Sidebar */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children} {/* Page content goes here */}
      </main>
    </div>
  );
};



