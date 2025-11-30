import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './DetailModal.module.css';

const HUB_MAPPING = {
  "Phewa Lake": "Pokhara",
  "Davis Falls": "Pokhara",
  "World Peace Pagoda": "Pokhara",
  "Sarangkot Viewpoint": "Pokhara",
  "Gupteshwor Mahadev Cave": "Pokhara",
  "Bindhyabasini Temple": "Pokhara",
  "Mahendra Cave": "Pokhara",
  "Bat Cave (Chamere Gufa)": "Pokhara",
  "International Mountain Museum": "Pokhara",
  "Begnas Lake": "Pokhara",
  "Tal Barahi Temple": "Pokhara",
  "Gurkha Memorial Museum": "Pokhara",

  "Kanyam Tea Garden": "Ilam",
  "Antu Danda": "Ilam",
  "Mai Pokhari": "Ilam",
  "Sandakpur": "Ilam",

  "Gorkha Durbar": "Gorkha",
  "Manakamana Temple": "Gorkha",
  "Barpak Village": "Gorkha",

  "Swayambhunath": "Kathmandu",
  "Pashupatinath": "Kathmandu",
  "Boudhanath": "Kathmandu"
};

export default function DetailModal({ destination, onClose }) {
  const [mainImage, setMainImage] = useState(
    (destination.imageUrls && destination.imageUrls.length > 0)
      ? destination.imageUrls[0]
      : `https://placehold.co/600x400/EFEFEF/333?text=${encodeURIComponent(destination.name)}`
  );

  const [lodgings, setLodgings] = useState([]);
  const [isLoadingLodgings, setIsLoadingLodgings] = useState(true);


  useEffect(() => {
    setMainImage(
      (destination.imageUrls && destination.imageUrls.length > 0)
        ? destination.imageUrls[0]
        : `https://placehold.co/600x400/EFEFEF/333?text=${encodeURIComponent(destination.name)}`
    );
  }, [destination]);


  useEffect(() => {
    if (destination.name) {
      setIsLoadingLodgings(true);
      
      async function fetchLodgings() {
        try {
         const searchArea = HUB_MAPPING[destination.name] || destination.name;
          const response = await fetch(`/api/lodging/by-area?area=${encodeURIComponent(searchArea)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch lodgings');
          }
          const data = await response.json();
          setLodgings(data);
        } catch (error) {
          console.error(error);
          setLodgings([]);
        } finally {
          setIsLoadingLodgings(false);
        }
      }
      fetchLodgings();
    }
  }, [destination.name]);

  if (!destination) return null;

  return (
    <div 
      className={styles.backdrop}
      onClick={onClose}
    >
      <div 
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{destination.name}</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={`${styles.modalBody}`}>
          <div>
            {/* --- Main Image --- */}
            <Image
              src={mainImage}
              alt="Main destination image"
              width={600}
              height={400}
              className={styles.mainImage}
            />
            {/* --- Thumbnails --- */}
            <div className={styles.thumbnails}>
              {destination.imageUrls && destination.imageUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`${destination.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  onClick={() => setMainImage(url)}
                  className={styles.thumbImage}
                />
              ))}
            </div>
          </div>
          <div className={styles.detailsContent}>
            {/* --- Description --- */}
            <p className={styles.description}>{destination.longDescription}</p>
            {/* --- Tags --- */}
            <div>
              <span className={`${styles.tag} ${styles.tagProvince}`}>
                {destination.province}
              </span>
              <span className={`${styles.tag} ${styles.tagCategory}`}>
                {destination.category}
              </span>
            </div>

            {/* --- KEY ATTRACTIONS (THIS IS THE RESTORED CODE) --- */}
            <h4 className={styles.attractionsTitle}>Key Attractions</h4>
            <ul className={styles.attractionsList}>
              {destination.keyAttractions && destination.keyAttractions.length > 0 ? (
                destination.keyAttractions.map((attraction, index) => (
                  <li key={index}>{attraction}</li>
                ))
              ) : (
                <li>No key attractions listed.</li>
              )}
            </ul>
    


            {/* --- RECOMMENDED LODGING --- */}
            <h4 className={styles.lodgingTitle}>Recommended Lodging</h4>
            {isLoadingLodgings ? (
              <p className={styles.loadingText}>Loading lodgings...</p>
            ) : lodgings.length > 0 ? (
              <div className={styles.lodgingList}>
                {lodgings.map((hotel) => (
                  <Link href={`/lodging/${hotel.id}`} key={hotel.id} className={styles.hotelLink}>
                    <div className={styles.hotelCard}>
                      <Image
                        src={hotel.imageUrl || `https://placehold.co/100x80/EFEFEF/333?text=Hotel`}
                        alt={hotel.name}
                        width={100}
                        height={80}
                        className={styles.hotelImage}
                      />
                      <div className={styles.hotelContent}>
                        <h5>{hotel.name}</h5>
                        <p>{hotel.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.loadingText}>No local lodgings found for this destination.</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}