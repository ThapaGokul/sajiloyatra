"use client";

import { useSearchParams } from 'next/navigation';
import PageHeader from '../../../components/PageHeader';
import BusResultCard from '../../../components/BusResultCard';
import styles from './BusResults.module.css';

// This is our DUMMY DATA.
const dummyBuses = [
  { id: 1, name: 'Sajilo Yatra Express', type: 'A/C Deluxe', departureTime: '07:00 AM', arrivalTime: '02:00 PM', price: 1200 },
  { id: 2, name: 'Himalayan Tours & Travels', type: 'Sofa Bus (VIP)', departureTime: '08:30 AM', arrivalTime: '03:30 PM', price: 1800 },
  { id: 3, name: 'Pokhara Regular', type: 'Non A/C', departureTime: '09:00 AM', arrivalTime: '04:30 PM', price: 800 },
];

export default function BusResultsPage() {
  const searchParams = useSearchParams();
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  return (
    <div>
      <PageHeader
        imageUrl="/images/bus-hero.jpg" 
        title="Available Buses"
        description={`Travel on ${date}`}
      />

      <div className={styles.container}>
        <div className={styles.resultsHeader}>
          <h1>Showing buses from {from} to {to}</h1>
          <p>{dummyBuses.length} buses found.</p>
        </div>

        <div className={styles.resultsList}>
          {dummyBuses.map(bus => (
            <BusResultCard key={bus.id} bus={bus} />
          ))}
        </div>
      </div>
    </div>
  );
}