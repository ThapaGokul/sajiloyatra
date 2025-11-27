// /src/components/ContactGuideModal.js
"use client";

import styles from './ContactGuideModal.module.css';
import { useState } from 'react';

export default function ContactGuideModal({ guide, onClose }) {
  const [isSending, setIsSending] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const formData = {
      guideId: guide.id,
      senderName: e.target.name.value,
      senderEmail: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch('/api/contact-host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Your message has been sent to ${guide.name}!`);
        onClose();
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Contact {guide.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" className={styles.textarea} required></textarea>
          </div>
          <button type="submit" className={styles.sendButton}     disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}