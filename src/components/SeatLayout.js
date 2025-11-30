"use client";

import { useState } from 'react';
import styles from './SeatLayout.module.css';

const alreadyBooked = ['1A', '1B', '3C', '4D'];
const seats = [];
for (let i = 1; i <= 10; i++) {
  seats.push(i + 'A', i + 'B', 'aisle', i + 'C', i + 'D');
}

export default function SeatLayout({ selectedSeats, onSeatSelected }) {
  
  const getSeatStatus = (seat) => {
    if (alreadyBooked.includes(seat)) {
      return styles.booked;
    }
    if (selectedSeats.includes(seat)) {
      return styles.selected;
    }
    return styles.available;
  };

  const handleSeatClick = (seat) => {
    if (alreadyBooked.includes(seat)) {
      return; 
    }
    onSeatSelected(seat); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.steeringWheel}>🚌</div>
      <div className={styles.seatGrid}>
        {seats.map((seat, index) => {
          if (seat === 'aisle') {
            return <div key={index} className={styles.aisle}></div>;
          }
          return (
            <div
              key={seat}
              className={`${styles.seat} ${getSeatStatus(seat)}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat}
            </div>
          );
        })}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.available}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.selected}`}></div>
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.booked}`}></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}