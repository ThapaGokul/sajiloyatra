import Image from 'next/image';
import styles from './LocalGuideCard.module.css';

export default function LocalGuideCard({ guide, onContactClick }) {
  const { name, location, bio, imageUrl, specialty } = guide;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.content}>
        <h3>{name}</h3>
        <p className={styles.location}>{location}</p>
        <span className={styles.specialty}>{specialty}</span>
        <p>{bio}</p>
        <button
         className={styles.contactButton}
         onClick={() => onContactClick(guide)}
        >Contact {name.split(' ')[0]}</button>
      </div>
    </div>
  );
}