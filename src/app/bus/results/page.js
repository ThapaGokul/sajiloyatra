import { Suspense } from 'react';
import BusResultsClient from './BusResultsClient';
import styles from './BusResults.module.css';

function LoadingFallback() {
  return (
    <div className={styles.container}>
      <h2>Loading bus results...</h2>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BusResultsClient />
    </Suspense>
  );
}