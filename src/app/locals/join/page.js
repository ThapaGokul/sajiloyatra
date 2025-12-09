"use client";

import PageHeader from '../../../components/PageHeader';
import LocalHostForm from '../../../components/LocalHostForm';
import styles from './JoinPage.module.css';

export default function JoinPage() {
  return (
    <div>
      <PageHeader
        imageUrl="/images/local1.jpg"
        title="Become a Local Host"
        description="Share your culture, home, and experiences with travelers from around the world."
      />
      <div className={styles.container}>
        <LocalHostForm />
      </div>
    </div>
  );
}