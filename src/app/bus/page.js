"use client";

import PageHeader from '../../components/PageHeader';
import BusSearchForm from '../../components/BusSearchForm';
import styles from './BusPage.module.css';

export default function BusPage() {
  return (
    <div>
      <PageHeader
        imageUrl="/images/bus-hero.jpg"
        title="Book Your Bus Ticket"
        description="Travel across Nepal with our reliable and comfortable bus network."
      />

      <div className={styles.container}>
        <BusSearchForm />
      </div>

    </div>
  );
}