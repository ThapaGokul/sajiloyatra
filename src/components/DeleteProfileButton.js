
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react'; 

import styles from './DeleteProfileButton.module.css'

export default function DeleteProfileButton({ type, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();


  const endpoint = type === 'guide' ? '/api/guides' : '/api/locals';
  const label = type === 'guide' ? 'Guide' : 'Local';

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to stop being a ${label}? This will remove your public profile.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert(`${label} profile deleted successfully.`);

        if (onDeleteSuccess) {
            onDeleteSuccess();
        }    
        router.refresh(); 
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className={styles.deleteButton}
    >
      <Trash2 size={18} />
      {isDeleting ? "Removing..." : `Unregister as ${label}`}
    </button>
  );
}