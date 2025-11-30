import Link from 'next/link';
import Image from 'next/image';
import styles from './TripPlannerNav.module.css';
import { plannerNavData } from '../data/data';

export default function TripPlannerNav() {
  return (
    <section className={styles.container}>
      <h2>Plan Your Journey</h2>
      <div className={styles.grid}>
        {plannerNavData.map(item => (
          <Link href={item.href} key={item.id} className={styles.navItem}>
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill={true}
              className={styles.image}
            />
            <div className={styles.overlay}></div>
            <h3 className={styles.title}>{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}