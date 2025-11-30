"use client"; 

import { useState, useEffect } from 'react'; 
import PageHeader from '../../components/PageHeader';
import LodgingCard from '../../components/LodgingCard';
import FilterSidebar from '../../components/FilterSidebar';
import styles from './LodgingPage.module.css';

export default function LodgingPage() {
  const [allLodgings, setAllLodgings] = useState([]);
  const [filteredLodgings, setFilteredLodgings] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    area: [], 
  });

  const handleFilterChange = (category, value) => {
    setActiveFilters(prevFilters => {
      const currentValues = prevFilters[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value) 
        : [...currentValues, value]; 
      
      return {
        ...prevFilters,
        [category]: newValues,
      };
    });
  };

  // Fetch lodgings from our API when the component mounts
  useEffect(() => {
    async function getLodgings() {
      const response = await fetch('/api/lodging'); 
      if (response.ok) {
        const data = await response.json();
        setAllLodgings(data);
        setFilteredLodgings(data); 

        const uniqueAreas = [...new Set(data.map(lodging => lodging.area))];
        uniqueAreas.sort(); 
        setAvailableAreas(uniqueAreas);

      } else {
        console.error("Failed to fetch lodgings");
      }
    }
    getLodgings();
  }, []); 

    useEffect(() => {
    let results = [...allLodgings]; 

    if (activeFilters.area.length > 0) {
      results = results.filter(lodging => 
        activeFilters.area.includes(lodging.area)
      );
    }



    setFilteredLodgings(results);
  }, [activeFilters, allLodgings]); 
  return (
    <div>
      <PageHeader
        imageUrl="/images/nepal-hotel-hero.jpg"
        title="Find Your Perfect Stay"
        description="From cozy inns with stunning peak views to rustic cabins by the serene river, discover the best places to rest in the heart of the Himalayas."
      />

      <div className={styles.container}>
        <div className={styles.mainContent}>
          <button 
            className={styles.mobileFilterToggle} 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? 'Close Filters' : 'Show Filters'} 
            {activeFilters.area.length > 0 && ` (${activeFilters.area.length})`}
          </button>


          <div className={`${styles.sidebar} ${showMobileFilters ? styles.show : ''}`}>
            <FilterSidebar
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              availableAreas={availableAreas}
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
          <div className={styles.resultsGrid}>
            {filteredLodgings.map(lodging => (
              <LodgingCard
                key={lodging.id}
                id={lodging.id}
                name={lodging.name}
                description={lodging.description}
                imageUrl={lodging.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}