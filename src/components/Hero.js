import styles from './Hero.module.css';

function Hero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Unforgettable Journeys</h1>
      <p className={styles.subtitle}>Discover the true heart of the Himalayas.</p>
    </div>
  );
}

export default Hero;