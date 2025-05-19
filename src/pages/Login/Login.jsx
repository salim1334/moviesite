import styles from './Login.module.css';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { login, signup } from '../../../firebase/firebase';
import spinner from '../../assets/loading_with_logo.gif';

function Login() {
  // State for toggling between Sign In and Sign Up
  const [signState, setSignState] = useState('Sign In');

  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Loading spinner state
  const [loading, setLoading] = useState(false);

  // Handles form submission for login/signup
  const user_auth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (signState === 'Sign In') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (error) {
      alert(error.message); // You can handle errors better here
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while authenticating
  if (loading) {
    return (
      <div className={styles.login_spinner}>
        <img src={spinner} alt="Loading spinner" />
      </div>
    );
  }

  return (
    <div className={styles.login}>
      {/* Netflix logo */}
      <img src={logo} alt="Netflix Logo" className={styles.login_logo} />

      <div className={styles.login_form}>
        <h1>{signState}</h1>

        {/* Authentication form */}
        <form onSubmit={user_auth}>
          {/* Name input only visible for sign-up */}
          {signState === 'Sign Up' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{signState}</button>

          <div className={styles.form_help}>
            <div className={styles.remember}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>{' '}
              {/* ✅ Accessibility fix */}
            </div>
            <p>Need help?</p>
          </div>
        </form>

        {/* Switch between Sign In and Sign Up */}
        <div className={styles.form_switch}>
          {signState === 'Sign In' ? (
            <p>
              New to Netflix?{' '}
              <span onClick={() => setSignState('Sign Up')}>Sign Up Now</span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span onClick={() => setSignState('Sign In')}>Sign In Now</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
