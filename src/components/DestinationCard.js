import Image from 'next/image';
import styles from './DestinationCard.module.css';


const isValidUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

export default function DestinationCard({ dest, onLearnMore }) {
  const { name, province, shortDescription, imageUrls } = dest;

  let validImageUrl = null;

  //  Check if the array exists and has an item
  if (imageUrls && imageUrls.length > 0) {
    // Check if that item is a *valid* URL string
    if (isValidUrl(imageUrls[0])) {
      validImageUrl = imageUrls[0];
    }
  }

  // If no valid URL was found, set the fallback
  const imageUrl = validImageUrl 
    ? validImageUrl
    : `https://placehold.co/600x400/EFEFEF/333?text=${encodeURIComponent(name)}`;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={() => onLearnMore(dest)}>
        <Image
          src={imageUrl} 
          alt={name}
          fill={true}
          className={styles.image}
        />
        <div className={styles.imageOverlay}></div>
        <div className={styles.overlayText}>
          <span>Learn More</span>
        </div>
      </div>
      <div className={styles.content}>
        <h5>{name}</h5>
        <p>{shortDescription}</p>
        <p className={styles.location}>
          <strong>Location:</strong> {province}
        </p>
      </div>
      <div className={styles.footer}>
        <button
          className={styles.learnMoreButton}
          onClick={() => onLearnMore(dest)}
        >
          Learn More &rarr;
        </button>
      </div>
    </div>
  );
}