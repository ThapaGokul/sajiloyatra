// /src/app/profile/page.js
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProfilePage.module.css';
import PageHeader from '../../components/PageHeader'; // <-- We'll use our header
import LocalGuideCard from '../../components/LocalGuideCard'; 

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [hostProfile, setHostProfile] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); 

  useEffect(() => {
    if (user) {
      async function fetchData() {
        setIsLoadingData(true);
        try {
          const [bookingsRes, hostProfileRes] = await Promise.all([
            fetch('/api/bookings/me'),
            fetch('/api/guides/me')
          ]);

          if (bookingsRes.ok) setBookings(await bookingsRes.json());
          if (hostProfileRes.ok) setHostProfile(await hostProfileRes.json());
          
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        } finally {
          setIsLoadingData(false);
        }
      }
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user && hostProfile) {
      // Only fetch messages if user is a host
      fetch('/api/guides/messages')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data);
        });
    }
  }, [user, hostProfile]);


  if (isAuthLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className={styles.emptyContainer}>
        <p>Please <Link href="/login" className={styles.loginLink}>login</Link> to view your profile.</p>
      </div>
    );
  }

  // --- Helper components for each tab ---
  const BookingsContent = () => {
    if (isLoadingData) return <div className={styles.loading}>Loading bookings...</div>;
    if (bookings.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>You have no bookings yet.</p>
          <Link href="/lodging" className={styles.ctaButton}>Find a Place to Stay</Link>
        </div>
      );
    }
    return (
      <div className={styles.bookingList}>
        {bookings.map(booking => (
          <div key={booking.id} className={styles.bookingCard}>
            <h3>{booking.lodging.name}</h3>
            <p><strong>Area:</strong> {booking.lodging.area}</p>
            <p>
              <strong>Dates:</strong> 
              {new Date(booking.checkIn).toLocaleDateString()} - 
              {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p><strong>Payment ID:</strong> {booking.paymentId}</p>
          </div>
        ))}
      </div>
    );
  };

  const HostProfileContent = () => {
    if (isLoadingData) return <div className={styles.loading}>Loading host profile...</div>;
    if (hostProfile) {
      return (
        <div>
          <p className={styles.profileIntro}>This is your public host profile. You can edit this in the future.</p>
          <LocalGuideCard guide={hostProfile} onContactClick={() => {}} />
        </div>
      );
    }
    return (
      <div className={styles.emptyState}>
        <p>You are not a local host yet.</p>
        <Link href="/locals/join" className={styles.ctaButton}>
          Become a Host
        </Link>
      </div>
    );
  };

  const InquiriesContent = () => {
    if (!hostProfile) return <div className={styles.emptyState}>You must be a host to receive inquiries.</div>;
    
    if (messages.length === 0) {
      return <div className={styles.emptyState}>No inquiries yet.</div>;
    }

    return (
      <div className={styles.bookingList}>
        {messages.map(msg => (
          <div key={msg.id} className={styles.bookingCard} style={{borderLeft: '4px solid #007bff'}}>
            <h3>From: {msg.senderName}</h3>
            <p style={{fontSize: '0.9rem', color: '#888'}}>{new Date(msg.createdAt).toLocaleDateString()}</p>
            <p><strong>Email:</strong> {msg.senderEmail}</p>
            <hr style={{margin: '10px 0', border: '0', borderTop: '1px solid #eee'}}/>
            <p>{msg.content}</p>
            <a href={`mailto:${msg.senderEmail}`} className={styles.joinButton} style={{fontSize: '0.9rem', padding: '8px 15px'}}>
              Reply via Email
            </a>
          </div>
        ))}
      </div>
    );
  };



  // --- Main Page Render ---
  return (
    <>
      <PageHeader
        imageUrl="/images/profile-hero.jpg" // You'll need a new hero image
        title={`Welcome, ${user.name.split(' ')[0]}`}
        description={`Manage your bookings and host profile all in one place.`}
      />

      <div className={styles.container}>
        {/* --- Tab Navigation --- */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'bookings' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Lodging Bookings
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'host' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('host')}
          >
            My Host Profile
          </button>

          {hostProfile && (
            <button
              className={`${styles.tabButton} ${activeTab === 'inquiries' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              Client Inquiries
            </button>
          )}

        </div>

        {/* --- Tab Content --- */}
        <div className={styles.tabContent}>
          {activeTab === 'bookings' && <BookingsContent />}
          {activeTab === 'host' && <HostProfileContent />}
          {activeTab === 'inquiries' && <InquiriesContent />}
        </div>
      </div>
    </>
  );
}