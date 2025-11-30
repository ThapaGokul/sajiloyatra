import Image from 'next/image';
import Link from 'next/link';
import styles from './RouteCard.module.css';
import { MapPin, Clock, Calendar } from 'lucide-react'; 

export default function RouteCard({ route }) {

  return (
    <div className={styles.card}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroOverlay}></div> 
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
            <h2 className={styles.title}>{route.name}</h2>
            
            <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                    <Clock size={16} /> {route.duration}
                </span>
                <span className={styles.metaItem}>
                    <MapPin size={16} /> {route.category}
                </span>
            </div>
        </div>

        <p className={styles.description}>{route.description}</p>
        
        <div className={styles.divider}></div>

      
        <h3 className={styles.itineraryTitle}>Trip Itinerary</h3>
        
        <div className={styles.itineraryList}>
          {route.days && Array.isArray(route.days) ? (
            route.days.map(day => (
              <div key={day.dayNumber} className={styles.dayRow}>
                
                <div className={styles.dayBadge}>
                  <span className={styles.dayLabel}>Day</span>
                  <span className={styles.dayNumber}>{day.dayNumber}</span>
                </div>
                <div className={styles.dayContent}>
                  <h4 className={styles.dayTitle}>
                    {day.title}
                  </h4>
                  <p className={styles.dayDesc}>{day.description}</p>
                  {day.destination && (
                      <div className={styles.destinationTag}>
                        <MapPin size={12} /> 
                        <span>Stay: {day.destination.name}</span>
                      </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noInfo}>Itinerary details coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}