// /src/app/admin/layout.js
"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
 
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/'); 
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div style={{padding: '100px'}}>Loading Admin Portal...</div>;
  
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className={styles.container}>
     
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          SY <span>Admin</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/admin/bookings" className={styles.navLink}>
            All Bookings
          </Link>
          <Link href="/admin/hosts" className={styles.navLink}>
            Manage Hosts
          </Link>
          
       
          <Link href="/" className={`${styles.navLink} ${styles.exitLink}`}>
            Exit to Main Site
          </Link>
        </nav>
      </aside>

  
      <main className={styles.mainContent}>
        <div className={styles.card}>
          {children}
        </div>
      </main>
    </div>
  );
}