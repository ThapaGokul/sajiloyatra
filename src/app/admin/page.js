// /src/app/admin/page.js
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Welcome to the control center.</p>
      </div>
      
      <div className={styles.statsGrid}>
        {/* Blue Card */}
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <span className={`${styles.statLabel} ${styles.statTitleBlue}`}>
            Total Bookings
          </span>
          <p className={styles.statValue}>124</p>
        </div>

        {/* Green Card */}
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <span className={`${styles.statLabel} ${styles.statTitleGreen}`}>
            Active Hosts
          </span>
          <p className={styles.statValue}>45</p>
        </div>

        {/* Purple Card */}
        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <span className={`${styles.statLabel} ${styles.statTitlePurple}`}>
            Revenue
          </span>
          <p className={styles.statValue}>Rs. 4.5L</p>
        </div>
      </div>
    </div>
  );
}