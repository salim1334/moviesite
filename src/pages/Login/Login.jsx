import styles from './Login.module.css';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import { login, signup } from '../../../firebase/firebase';
import spinner from '../../assets/loading_with_logo.gif'

function Login() {
  const [signState, setSignState] = useState('Sign In');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const user_auth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (signState === 'Sign In') {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
    setLoading(false);
  };

  return loading ? (
    <div className={styles.login_spinner}>
      <img src={spinner} alt="spinner" />
    </div>
  ) : (
    <div className={styles.login}>
      <img src={logo} alt="Logo" className={styles.login_logo} />
      <div className={styles.login_form}>
        <h1>{signState}</h1>
        <form>
          {signState === 'Sign Up' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={user_auth} type="submit">
            {signState}
          </button>
          <div className={styles.form_help}>
            <div className={styles.remember}>
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need help?</p>
          </div>
        </form>

        <div className={styles.form_switch}>
          {signState === 'Sign In' ? (
            <p>
              New to Netflix?
              <span onClick={() => setSignState('Sign Up')}>Sign Up Now</span>
            </p>
          ) : (
            <p>
              Already have account?
              <span onClick={() => setSignState('Sign In')}>Sign In Now</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
