"use client";

import PageHeader from '../../components/PageHeader';
import styles from './Events.module.css';

const events = [
  {
    id: 1,
    date: "Nov 15 - Nov 17",
    title: "Photo Kathmandu",
    location: "Patan, Lalitpur",
    description: "An international photography festival featuring exhibitions, workshops, and talks celebrating visual storytelling."
  },
  {
    id: 2,
    date: "Dec 25",
    title: "Street Festival",
    location: "Lakeside, Pokhara",
    description: "Celebrate the New Year with Nepal's biggest street festival. Food stalls, live music, and cultural performances fill the streets."
  },
  {
    id: 3,
    date: "Feb 10",
    title: "Lhosar (Tibetan New Year)",
    location: "Boudhanath Stupa",
    description: "Experience the vibrant masked dances and prayers at the monasteries around Boudhanath to welcome the new year."
  },
  {
    id: 4,
    date: "Mar 08",
    title: "Maha Shivaratri",
    location: "Pashupatinath Temple",
    description: "A massive gathering of sadhus and devotees celebrating Lord Shiva. A visually stunning and spiritual experience."
  }
];

export default function EventsPage() {
  return (
    <div>
      <PageHeader
        imageUrl="/images/events-hero.jpg"
        title="Cultural Events"
        description="Immerse yourself in the vibrant festivals, art, and music of Nepal."
      />

      <div className={styles.container}>
        <div className={styles.grid}>
          {events.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.dateBox}>{event.date}</div>
              <div className={styles.content}>
                <span className={styles.location}>{event.location}</span>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.description}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}