// /src/app/guides/join/page.js
"use client";

import PageHeader from '../../../components/PageHeader';
import ProfessionalGuideForm from '../../../components/ProfessionalGuideForm';
// Reuse the CSS from the host join page
import styles from '../../locals/join/JoinPage.module.css'; 

export default function JoinGuidePage() {
  return (
    <div>
      <PageHeader
        imageUrl="/images/guides-hero.jpg"
        title="Join as a Professional"
        description="Grow your career. Connect with travelers looking for certified experts like you."
      />
      <div className={styles.container}>
        <ProfessionalGuideForm />
      </div>
    </div>
  );
}