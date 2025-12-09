"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './TravelerStory.module.css';

const stories = [
  {
    id: 1,
    image: "/images/story1.jpg",
    text: "We were in Nepal for 8 days on a tour organized by Sajilo Yatra. I cannot speak highly enough about our guide and driver. These 2 guys were the absolute most accommodating fellows I have met in the travel business. Nothing was too big of a problem for them.",
    author: "Dwaine D"
  },
  {
    id: 2,
    image: "/images/story2.jpg", 
    text: "Walking through the ancient streets of Bhaktapur felt like stepping back in time. The architecture is stunning, and the local Newari food was a highlight of my trip. Highly recommend the guided heritage walk!",
    author: "Sarah Jenkins"
  },
  {
    id: 3,
    image: "/images/story3.jpg", 
    text: "The Annapurna Circuit was challenging but absolutely worth every step. Our guide ensured we were safe and comfortable the entire time. The sunrise from Poon Hill is a memory I will cherish forever.",
    author: "Michael Chen"
  }
];

export default function TravelerStory() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const story = stories[currentIndex];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Traveler&apos;s Story</h2>
          <p className={styles.subtitle}>
            Don&apos;t take our word for it! Read first-hand experiences from those who have traveled with us.
          </p>
        </div>
        
        <div className={styles.controls}>
          <button onClick={handlePrev} className={styles.arrowButton}>&larr;</button>
          <button onClick={handleNext} className={styles.arrowButton}>&rarr;</button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.imageWrapper}>
            <Image 
              src={story.image} 
              alt="Traveler experience" 
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.textWrapper}>
            <p className={styles.quote}>&quot;{story.text}&quot;</p>
            <span className={styles.author}>— {story.author}</span>
          </div>
        </div>
      </div>
    </section>
  );
}