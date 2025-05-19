import React, { useEffect, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { ToastContainer } from 'react-toastify';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home/Home'));
const Login = React.lazy(() => import('./pages/Login/Login'));

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const currentPath = window.location.pathname;

      // Redirect authenticated user to homepage if not already there
      if (user && currentPath !== '/') {
        navigate('/');
      }

      // Redirect unauthenticated user to login page if not already there
      if (!user && currentPath !== '/login') {
        navigate('/login');
      }
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <ToastContainer theme="dark" />

      {/* Suspense for lazy loaded routes */}
      <Suspense
        fallback={
          <div style={{ color: 'white', textAlign: 'center' }}>
            Loading page...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
