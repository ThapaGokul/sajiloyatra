import Link from 'next/link';
import styles from '../BookingStatus.module.css';
export default function BookingFailPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.titleError}>Payment Failed</h1>
      <p>There was an error with your payment, or the payment was cancelled.</p>
      <Link href="/lodging" className={styles.button}>
        Try Again
      </Link>
    </div>
  );
}