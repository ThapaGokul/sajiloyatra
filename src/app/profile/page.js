"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProfilePage.module.css';
import PageHeader from '../../components/PageHeader'; 
import LocalGuideCard from '../../components/LocalGuideCard'; 
import DeleteProfileButton from '@/components/DeleteProfileButton';


export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); 

  useEffect(() => {
    if (user) {
      async function fetchData() {
        setIsLoadingData(true);
        try {
          const [bookingsRes, ProfileRes] = await Promise.all([
            fetch('/api/bookings/me'),
            fetch('/api/guides/me')
          ]);

          if (bookingsRes.ok) setBookings(await bookingsRes.json());
          if (ProfileRes.ok) setMyProfile(await ProfileRes.json());
          
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
    if (user && myProfile) {
      // Only fetch messages if user is a host
      fetch('/api/guides/messages')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data);
        });
    }
  }, [user, myProfile]);

  const handleProfileDeleted = () => {
    setMyProfile(null);
    setActiveTab('bookings');
  };


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

  const isGuide = myProfile?.type === 'PROFESSIONAL';
  const profileLabel = isGuide ? "My Guide Profile" : "My Host Profile";
  const deleteType = isGuide ? "guide" : "local";



  //  Helper components for each tab 
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

  const ProfileContent = () => {
    if (isLoadingData) return <div className={styles.loading}>Loading profile...</div>;
    if (myProfile) {
      return (
        <div>
          <p className={styles.profileIntro}>This is your public host profile. You can edit this in the future.</p>
          <LocalGuideCard guide={myProfile} onContactClick={() => {}} />

            <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #fee2e2', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
            <h3 style={{ fontSize: '1rem', color: '#dc2626', marginBottom: '8px', fontWeight: 'bold' }}>Warning</h3>
            <p style={{ fontSize: '0.9rem', color: '#7f1d1d', marginBottom: '15px' }}>
              No longer want to be listed as a host? This will permanently delete your public profile and messages.
            </p>
            <DeleteProfileButton type={deleteType} 
            onDeleteSuccess={handleProfileDeleted}/>
          </div>
        </div>
      );
    }
    return (
     <div className={styles.emptyState}>
        <p>You do not have a public profile yet.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <Link href="/locals/join" className={styles.ctaButton}>
            Become a Host
            </Link>
            <Link href="/guides/join" className={styles.ctaButton} style={{backgroundColor: '#2563eb'}}>
            Become a Guide
            </Link>
        </div>
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



  // Main Page Render 
  return (
    <><section className={styles.profileHeader}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>{`Welcome, ${user.name.split(' ')[0]}`}</h1>
        <p className={styles.description}>{`Manage your bookings and host profile all in one place.`}</p>
      </div>
      </section>

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
            My Profile
          </button>

          {myProfile && (
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
          {activeTab === 'host' && <ProfileContent />}
          {activeTab === 'inquiries' && <InquiriesContent />}
        </div>
      </div>
    </>
  );
}