

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import styles from './signup.module.css'; // reuse same styles

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Reset link sent! Check your inbox.");
        setError('');
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          setError('User not found with this email.');
        } else {
          setError(err.message);
        }
      }
      
  };

  return (
    <div className={styles.formContainer}>
      <h1>Reset Password</h1>
      <form onSubmit={handleReset}>
        <label className={styles.lbl}>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.int}
        />

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" className={styles.btn}>Send Reset Link</button>
      </form>
    </div>
  );
};
