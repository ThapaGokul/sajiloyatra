"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import SeatLayout from '../../../components/SeatLayout';
import styles from './BusBook.module.css';

export default function BusBookPage() {
  const searchParams = useSearchParams();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const busId = searchParams.get('id');
  const busPrice = searchParams.get('price') || 1000; 
  const busName = searchParams.get('name') || 'Selected Bus';

  const handleSeatSelected = (seat) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seat)) {
        return prevSeats.filter((s) => s !== seat); 
      } else {
        return [...prevSeats, seat]; 
      }
    });
  };

  const totalCost = selectedSeats.length * busPrice;

  const handleBooking = () => {
    alert(`
      Booking Details (Frontend):
      Bus ID: ${busId}
      Seats: ${selectedSeats.join(', ')}
      Total Cost: Rs. ${totalCost}
    `);
  };

  return (
    <div>
  
      <PageHeader
        imageUrl="/images/bus-hero.jpg"
        title="Select Your Seats"
        description={`You are booking for: ${decodeURIComponent(busName)}`}
      />
      <div className={styles.container}>
        <div className={styles.details}>
          <SeatLayout 
            selectedSeats={selectedSeats}
            onSeatSelected={handleSeatSelected}
          />
        </div>
        
        <aside className={styles.summary}>
          <h2>Booking Summary</h2>
          <p>Bus: <span>{decodeURIComponent(busName)}</span></p>
          <p>Seats: <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span></p>
          <p>Price per seat: <span>Rs. {busPrice}</span></p>
          <p className={styles.total}>
            Total: <span>Rs. {totalCost}</span>
          </p>
          <button 
            className={styles.confirmButton}
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
          >
            Confirm Booking
          </button>
        </aside>
      </div>
    </div>
  );
}