"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from './BusSearchForm.module.css';

export default function BusSearchForm() {
  const [origin, setOrigin] = useState("Kathmandu");
  const [destination, setDestination] = useState("Pokhara");
  const [journeyDate, setJourneyDate] = useState(new Date());
  
  const router = useRouter(); 

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Format date to YYYY-MM-DD
    const dateString = journeyDate.toISOString().split('T')[0];

    // Navigate to the results page with the search parameters
    router.push(`/bus/results?from=${origin}&to=${destination}&date=${dateString}`);
  };

  return (
    <form className={styles.searchBox} onSubmit={handleSearch}>
      <div className={styles.inputGroup}>
        <label htmlFor="origin">From</label>
        <select
          id="origin"
          className={styles.input}
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        >
          <option value="Kathmandu">Kathmandu</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Chitwan">Chitwan</option>
          <option value="Lumbini">Lumbini</option>
        </select>
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="destination">To</label>
        <select
          id="destination"
          className={styles.input}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option value="Kathmandu">Kathmandu</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Chitwan">Chitwan</option>
          <option value="Lumbini">Lumbini</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label>Date</label>
        <DatePicker
          selected={journeyDate}
          onChange={(date) => setJourneyDate(date)}
          minDate={new Date()}
          className={styles.dateInput}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
}