'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext'; 
import WeatherModal from './WeatherModal';

export default function Header() {
  const { user, logout, isLoading } = useAuth(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const isHotelDetailPage = pathname.startsWith('/lodging/') && pathname !== '/lodging';
  const isSolid = isScrolled || pathname === '/register' || pathname === '/login' || pathname === '/contact' || pathname === '/profile' || isHotelDetailPage;
  const headerClassName = `${styles.header} ${isSolid ? styles.solid : ''}`;
  const navClassName = `${styles.nav} ${isMenuOpen ? styles.open : ''}`;

  const [showWeather, setShowWeather] = useState(false);

  return (
    <header className={headerClassName}>

  
      <div className={styles.utilityNav}>
        <Link href="/travel-guide">Visitor Guide</Link>
        <Link href="#">Blog</Link>
        <button 
          onClick={() => setShowWeather(true)} 
          style={{background:'none', border:'none', color:'white', cursor:'pointer', font:'inherit', marginRight: '5px'}}
        >
          Weather
        </button>
      </div>
      <div className={styles.mainNav}>
        <Link href="/" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 20h18L12 4 3 20zm4-4l5-9 5 9H7z" />
          </svg>

          <div className={styles.logoText}>
            <span>SAJILO</span>
            <span>YATRA</span>
          </div>
        </Link>

        <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg viewBox="0 0 100 80" width="25" height="25">
            <rect width="100" height="15"></rect>
            <rect y="30" width="100" height="15"></rect>
            <rect y="60" width="100" height="15"></rect>
          </svg>
        </button>

        <nav className={navClassName}>
          <Link href="/">Home</Link>
          <Link href="/destinations">Destinations</Link>
          <Link href="/locals">Find a Local</Link>
          <Link href="/guides">Local Guides</Link>

          {!isLoading && (
            user ? (
              <>
                <Link href="/profile">Profile</Link>
                <button onClick={logout} className={styles.logoutButton}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )
          )}
        </nav>
      </div>
      {showWeather && <WeatherModal onClose={() => setShowWeather(false)} />}
    </header>
  );
}