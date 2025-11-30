import Image from 'next/image';
import styles from './PageHeader.module.css';

const PageHeader = ({ imageUrl, title, description }) => {
  return (
    <section>
      <div className={styles.heroContainer}>
        <Image
          src={imageUrl}
          alt={`${title} hero image`}
          fill 
          className={styles.heroImage} 
          priority
        />
      </div>

      <div className={styles.textContainer}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
};

export default PageHeader;