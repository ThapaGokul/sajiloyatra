// /src/components/ProfessionalGuideForm.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LocalHostForm.module.css'; // We can reuse the same CSS!

export default function ProfessionalGuideForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    location: 'Kathmandu',
    specialty: 'Trekking', // Default for pros
    bio: '',
  });
  
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please upload a professional photo.");
      setIsError(true);
      return;
    }
    
    setMessage("Submitting application...");
    setIsError(false);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('specialty', formData.specialty);
    data.append('bio', formData.bio);
    data.append('imageUrl', file);
    
    // --- CRITICAL CHANGE: THIS IS A PROFESSIONAL ---
    data.append('type', 'PROFESSIONAL'); 

    const response = await fetch('/api/locals', {
      method: 'POST',
      body: data, 
    });

    if (response.ok) {
      setMessage('Professional Profile created! Redirecting...');
      setIsError(false);
      setTimeout(() => {
        router.push('/guides'); // Redirect to the GUIDES list
      }, 2000);
    } else {
      const resData = await response.json();
      setMessage(`Error: ${resData.error}`);
      setIsError(true);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 style={{marginBottom: '20px'}}>Professional Guide Application</h2>
      
      <div className={styles.inputGroup}>
        <label htmlFor="name">Full Legal Name</label>
        <input type="text" id="name" name="name" className={styles.input} value={formData.name} onChange={handleTextChange} required />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="location">Base City</label>
        <select id="location" name="location" className={styles.select} value={formData.location} onChange={handleTextChange}>
          <option value="Kathmandu">Kathmandu</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Lukla">Lukla (Everest Region)</option>
          <option value="Chitwan">Chitwan</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="specialty">Primary Expertise</label>
        <select id="specialty" name="specialty" className={styles.select} value={formData.specialty} onChange={handleTextChange}>
          <option value="Trekking Guide">Trekking Guide</option>
          <option value="Mountaineering">Mountaineering / Climbing</option>
          <option value="Cultural Heritage">Cultural Heritage</option>
          <option value="Nature & Wildlife">Nature & Wildlife</option>
          <option value="Adventure Sports">Adventure Sports</option>
        </select>
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="bio">Professional Experience & Bio</label>
        <textarea 
          id="bio" name="bio" className={styles.textarea} 
          placeholder="List your certifications, years of experience, and languages spoken..." 
          value={formData.bio} onChange={handleTextChange} required 
        ></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="imageUrl">Profile Photo</label>
        <input type="file" id="imageUrl" name="imageUrl" className={styles.input} accept="image/png, image/jpeg" onChange={handleFileChange} required />
      </div>

      <button type="submit" className={styles.submitButton}>Register as Guide</button>
      
      {message && (
        <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
          {message}
        </div>
      )}
    </form>
  );
}