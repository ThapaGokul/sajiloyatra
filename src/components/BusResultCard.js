import styles from './BusResultCard.module.css';
import Link from 'next/link'; 

export default function BusResultCard({ bus }) {
  const { id, name, type, departureTime, arrivalTime, price } = bus;

  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <h3>{name}</h3>
        <p className={styles.busType}>{type}</p>
        <div className={styles.timing}>
          <div>
            <label>Departs</label>
            <span>{departureTime}</span>
          </div>
          <div>
            <label>Arrives</label>
            <span>{arrivalTime}</span>
          </div>
        </div>
      </div>
      <div className={styles.bookingInfo}>
        <div className={styles.price}>Rs. {price}</div>
        {/* 2. Wrap the button in a Link */}
        <Link href={`/bus/book?id=${id}&price=${price}&name=${encodeURIComponent(name)}`}>
          <button className={styles.bookButton}>View Seats</button>
        </Link>
      </div>
    </div>
  );
}