// /src/app/register/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth/AuthForm.module.css'; // Use the shared CSS

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setIsError(false);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setMessage(data.error || 'Registration failed');
        setIsError(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("An unexpected error occurred.");
      setIsError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Account</h1>
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
              {message}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>

          <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button type="button" className={styles.googleButton} onClick={() => window.location.href = '/api/auth/google/init'}>
          <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className={styles.googleIcon} />
          Continue with Google
        </button>



          <Link href="/login" className={styles.link}>
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}