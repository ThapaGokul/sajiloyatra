import Image from 'next/image';
import Link from 'next/link';
import styles from './InfoSection.module.css';

export default function InfoSection() {
  return (
    <section className={styles.section}>
      <div className={styles.textColumn}>
        <h2 className={styles.title}>Culture & Himalayas: A Perfect Blend</h2>
        <p>Discover an experience unlike any other. From the ancient temples of Kathmandu to the breathtaking heights of the Everest region, Nepal offers a journey for the soul. Ready for a destination you have to see to believe?</p>
        <div className={styles.buttonContainer}>
          <Link href="/destinations?type=culture" className={styles.button}>Explore Major Areas</Link>
          <Link href="/destinations?type=trek" className={styles.button}>Find Treks & Base Camps</Link>
        </div>
      </div>

      <div className={styles.imageColumn}>
        <div className={styles.imageWrapperMain}>
        <Image
          src="/images/primary-story.jpg"
          alt="Primary scenic view of Nepal"
          fill={true}
          objectFit="cover"
          className={styles.primaryImage}
        />
        </div>
        <div className={styles.imageWrapperSecondary}>
        <Image
          src="/images/secondary-story.jpg"
          alt="Secondary stylized view of Nepal"
          width={220}
          height={280}
          className={styles.secondaryImage}
        />
        </div>
      </div>
    </section>
  );
}