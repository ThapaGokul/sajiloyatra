import { Suspense } from 'react';
import BusBookClient from './BusBookClient';
import styles from './BusBook.module.css'; 

function LoadingFallback() {
  return (
    <div className={styles.container}>
      <h2>Loading your booking...</h2>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusBookClient />
    </Suspense>
  );
}