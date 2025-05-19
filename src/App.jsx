import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { ToastContainer } from 'react-toastify';

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
      {/* Toast notifications */}
      <ToastContainer theme="dark" />

      {/* Routing */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
