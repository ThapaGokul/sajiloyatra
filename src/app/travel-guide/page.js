"use client";

import PageHeader from '../../components/PageHeader';
import styles from './TravelGuide.module.css';

export default function TravelGuidePage() {
  return (
    <div>
      <PageHeader
        imageUrl="/images/travel-guide-hero.jpg" 
        title="Nepal Travel Guide"
        description="Everything you need to know to plan your adventure in Nepal."
      />

      <div className={styles.container}>
        
        <section className={styles.section}>
          <h2 className={styles.heading}>Best Time to Visit</h2>
          <p className={styles.text}>
            Nepal has four main seasons. The best time to visit depends on what you want to do.
          </p>
          <div className={styles.highlightBox}>
            <span className={styles.highlightTitle}>Peak Season (Autumn: Sept - Nov)</span>
            Clear skies and moderate temperatures make this the best time for trekking.
          </div>
          <ul className={styles.list}>
            <li><strong>Spring (March - May):</strong> Warm weather and blooming rhododendrons. Great for trekking and wildlife.</li>
            <li><strong>Winter (Dec - Feb):</strong> Clear skies but cold. Good for low-altitude treks and jungle safaris.</li>
            <li><strong>Monsoon (June - Aug):</strong> Rain and leeches. Best for visiting Mustang and Dolpo (rain shadow areas).</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Visa Information</h2>
          <p className={styles.text}>
            Most nationalities can obtain a visa on arrival at Tribhuvan International Airport (TIA) in Kathmandu.
          </p>
          <ul className={styles.list}>
            <li>15 Days: $30 USD</li>
            <li>30 Days: $50 USD</li>
            <li>90 Days: $125 USD</li>
          </ul>
          <p className={styles.text}>
            You will need a passport valid for at least 6 months and a passport-sized photo (digital or physical).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Packing Essentials</h2>
          <p className={styles.text}>
            Pack layers! The temperature varies drastically with altitude.
          </p>
          <ul className={styles.list}>
            <li>Good quality hiking boots (broken in).</li>
            <li>Down jacket and thermal layers.</li>
            <li>Water purification tablets or LifeStraw.</li>
            <li>Universal power adapter.</li>
            <li>First aid kit with altitude sickness medication.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}