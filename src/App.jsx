import React, { useEffect, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { ToastContainer } from 'react-toastify';
import MovieDetails from './pages/MovieDetails/MovieDetails';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home/Home'));
const Login = React.lazy(() => import('./pages/Login/Login'));

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in and on login page, redirect to home
        if (window.location.pathname === '/Netflix_Clone/login') {
          navigate('/');
        }
      } else {
        // If user is not logged in and not on login page, redirect to login
        if (window.location.pathname !== '/Netflix_Clone/login') {
          navigate('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <ToastContainer theme="dark" />
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
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
