'use client';

import styles from '../../app/page.module.css'; 
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className={styles.container} style={{ paddingTop: '120px' }}>
      <form className={styles.form}>
        <h2>Contact Us</h2>
        <p>Have a question or a special request? Let us know!</p>

        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="email">Your Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          rows="6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}