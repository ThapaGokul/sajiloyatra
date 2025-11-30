// /src/app/lodging/[id]/LodgingClient.js
"use client";

import { useState } from 'react';
import styles from './LodgingDetails.module.css';
import PaymentPopup from '../../../components/PaymentPopup';
import { Wifi, Coffee, Car, Wind, CheckCircle2, MapPin, Star, Heart } from 'lucide-react';

// Helper for icons
const getAmenityIcon = (amenity) => {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi')) return <Wifi size={18} />;
  if (lower.includes('breakfast') || lower.includes('restaurant')) return <Coffee size={18} />;
  if (lower.includes('parking') || lower.includes('shuttle')) return <Car size={18} />;
  if (lower.includes('air')) return <Wind size={18} />;
  return <CheckCircle2 size={18} />; 
};

export default function LodgingClient({ lodging }) {
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  // Parse nearbyPlaces safely
  let nearbyPlaces = [];
  try {
    if (typeof lodging.nearbyPlaces === 'string') {
        nearbyPlaces = JSON.parse(lodging.nearbyPlaces) || [];
    } else if (Array.isArray(lodging.nearbyPlaces)) {
        nearbyPlaces = lodging.nearbyPlaces;
    }
  } catch (e) {
    console.error("Error parsing nearbyPlaces", e);
  }

  return (
    <div className={styles.pageContainer}>
      {/* 1. TOP BAR */}
      <div className={styles.topBar}>
        <nav className={styles.breadcrumbNav}>
          <a href="/lodging">Lodgings</a> &gt; <span>{lodging.area}</span>
        </nav>
      </div>

      {/* 2. HERO SECTION */}
      <div className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
            <img src={lodging.imageUrl} alt={lodging.name} className={styles.heroImage} />
        </div>
        <div className={styles.heroContent}>
            <h1 className={styles.hotelName}>{lodging.name}</h1>
            <div className={styles.ratingBlock}>
                <div className={styles.stars}>
                    {[...Array(Math.floor(lodging.starRating || 0))].map((_, i) => (
                        <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                </div>
                <span className={styles.reviewScore}>{lodging.reviewScore?.toFixed(1)}</span>
                <span className={styles.reviewText}>Wonderful</span>
                
                {/* --- RESTORED: Reviews Link --- */}
                <a href="#reviews" className={styles.reviewLink}>See all {lodging.reviewCount} reviews</a>
            </div>
            <p className={styles.address}><MapPin size={16} /> {lodging.address}</p>
        </div>
      </div>

      {/* 3. TABS SECTION */}
      <div className={styles.tabsContainer}>
        <ul className={styles.tabs}>
          <li><a href="#overview" className={styles.activeTab}>Overview</a></li>
          <li><a href="#rooms-section">Rooms</a></li>
          <li><a href="#amenities">Amenities</a></li>
          <li><a href="#location">Location</a></li>
        </ul>
      </div>

      {/* 4. DETAILS GRID */}
      <div className={styles.contentContainer}>
        <div className={styles.twoColumnGrid} id="overview">
          <div className={styles.leftColumn}>
            <section>
                <h2>About this property</h2>
                <p className={styles.description}>{lodging.description}</p>
            </section>
            <section id="amenities" className={styles.amenitiesSection}>
              <h2>Top amenities</h2>
              <div className={styles.amenitiesGrid}>
                {lodging.amenities && lodging.amenities.slice(0, 6).map((amenity, index) => (
                  <div key={index} className={styles.amenityItem}>
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <div className={styles.rightColumn} id="location">
            <section className={styles.locationSection}>
              <h2>What's nearby</h2>
              
              <div className={styles.mapContainer}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(lodging.name + " " + lodging.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  title={`${lodging.name} Map`}
                  className={styles.mapFrame}
                ></iframe>
              </div>
              
              <p className={styles.locationAddress}>{lodging.address}</p>
              <ul className={styles.nearbyList}>
                {Array.isArray(nearbyPlaces) && nearbyPlaces.map((place, index) => (
                  <li key={index}>
                    <MapPin size={16} className={styles.nearbyIcon} />
                    <span className={styles.nearbyName}>{place.name}</span>
                    <span className={styles.nearbyTime}>{place.time}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* 5. ROOMS SECTION */}
        <section id="rooms-section" className={styles.roomsSection}>
          <h2>Available Rooms</h2>
          <div className={styles.roomGrid}>
            {lodging.rooms && lodging.rooms.map((room) => (
              <div key={room.id} className={styles.roomCard}>
                 <div className={styles.roomImageContainer}>
                    <img
                        src={room.imageUrls?.[0] || '/images/defaults/room-default.jpg'}
                        alt={room.name}
                        className={styles.roomImage}
                    />
                </div>
                <div className={styles.roomContent}>
                    <h3 className={styles.roomTitle}>{room.name}</h3>
                    <p className={styles.roomDescription}>{room.description}</p>
                    <div className={styles.roomDetails}>
                        <span>Max Guests: {room.maxGuests}</span>
                    </div>
                    <div className={styles.roomFooter}>
                        <div className={styles.priceBlock}>
                            <span className={styles.price}>Rs. {room.pricePerNight.toLocaleString()}</span>
                            <span className={styles.perNight}>/ night</span>
                        </div>
                        
                        <button 
                          className={styles.reserveButton}
                          onClick={() => setSelectedRoomForBooking(room)}
                        >
                          Reserve
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6. POPUP COMPONENT */}
      {selectedRoomForBooking && (
        <PaymentPopup
          room={selectedRoomForBooking}
          lodgingName={lodging.name}
          lodgingId={lodging.id}
          onClose={() => setSelectedRoomForBooking(null)}
        />
      )}
    </div>
  );
}