// [REACT COMPONENT] /src/components/Footer.js
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footercontainer}>
        <div className={styles.column}>
          <h3>Explore</h3>
          <Link href="/destinations">Destinations</Link>
          <Link href="/locals">Find a Local</Link>
        </div>
        <div className={styles.column}>
          <h3>About</h3>
          <Link href="#">Our Story</Link>
          <Link href="#">Careers</Link>
        </div>
        <div className={styles.column}>
          <h3>Support</h3>
          <Link href="/contact">Contact Us</Link>
          <Link href="#">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}