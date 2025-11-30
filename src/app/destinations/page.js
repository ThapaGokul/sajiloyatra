"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import DestinationCard from '../../components/DestinationCard';
import RouteCard from '../../components/RouteCard';
import DetailModal from '../../components/DetailModal'; 
import styles from './DestinationsPage.module.css';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const isValidUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};


function DestinationsContent() {
  const searchParams = useSearchParams(); 
  const filterType = searchParams.get('type');
  const [activeView, setActiveView] = useState('destinations');
  const [allDestinations, setAllDestinations] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [destSearch, setDestSearch] = useState('');
  const [routeSearch, setRouteSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState(null);

  useEffect(() => {
    async function initializeApp() {
      setIsLoading(true);
      setError(null);
      try {
        const [destResponse, routeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/destinations`),
          fetch(`${API_BASE_URL}/api/v1/routes`)
        ]);

        if (!destResponse.ok) throw new Error('Failed to load destinations');
        const destData = await destResponse.json();
        setAllDestinations(destData);

        if (!routeResponse.ok) throw new Error('Failed to load routes');
        const routeData = await routeResponse.json();
        setAllRoutes(routeData);

      } catch (err) {
        console.error("Error initializing app:", err);
        setError(`Failed to load data. Make sure your API is running at ${API_BASE_URL}.`);
      }
      setIsLoading(false);
    }
    initializeApp();
  }, []);

  const openModal = (destination) => {
    setSelectedDest(destination);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDest(null);
  };

  const filteredDestinations = allDestinations.filter(dest => {
    const searchText = destSearch.toLowerCase().trim();
    const matchesSearch = !searchText || (
      dest.name.toLowerCase().includes(searchText) ||
      dest.province.toLowerCase().includes(searchText) ||
      dest.category.toLowerCase().includes(searchText)
    );
    let matchesType = true;
    if (filterType === 'trek') {
      // Show ONLY items with "Trekking" in the category
      matchesType = dest.category.toLowerCase().includes('trekking');
    } else if (filterType === 'culture') {
      // Show items that are NOT trekking (Major Areas)
      matchesType = !dest.category.toLowerCase().includes('trekking');
    }

    return matchesSearch && matchesType;
  });

  const filteredRoutes = allRoutes.filter(route => {
    const searchText = routeSearch.toLowerCase().trim();
    if (!searchText) return true;
    return (
      route.name.toLowerCase().includes(searchText) ||
      route.category.toLowerCase().includes(searchText)
    );
  });

  const renderLoading = () => (
    <div className={styles.loadingSpinner}>
      <svg className={styles.loadingIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
  
  const renderError = () => (
     <div className={styles.messageArea}>
        <p style={{color: 'red'}}>{error}</p>
     </div>
  );
  let pageTitle = "Explore Nepal";
  let pageDesc = "Find your next adventure, from serene lakes to the highest peaks.";
  
  if (filterType === 'trek') {
    pageTitle = "Treks & Base Camps";
    pageDesc = "Challenge yourself on the world's most famous trails.";
  } else if (filterType === 'culture') {
    pageTitle = "Major Cities & Culture";
    pageDesc = "Immerse yourself in the history and life of Nepal.";
  }



  return (
    <>
      <PageHeader
        title= {pageTitle}
        description= {pageDesc}
        imageUrl="/images/destination-hero.jpg" 
      />

      <main className={styles.container}>
        <nav className={styles.tabNav}>
          <button
            className={`${styles.tabButton} ${activeView === 'destinations' ? styles.tabActive : ''}`}
            onClick={() => setActiveView('destinations')}
          >
            Explore Destinations
          </button>
          <button
            className={`${styles.tabButton} ${activeView === 'routes' ? styles.tabActive : ''}`}
            onClick={() => setActiveView('routes')}
          >
            Find Planned Routes
          </button>
        </nav>

        {/* --- Destinations View --- */}
        <div style={{ display: activeView === 'destinations' ? 'block' : 'none' }}>

          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <input
                type="search"
                value={destSearch}
                onChange={(e) => setDestSearch(e.target.value)}
                placeholder="Search by name, province, or category..."
                className={styles.searchInput}
              />
              <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          {error && renderError()}
          {isLoading ? renderLoading() : (
            <div className={styles.grid}>
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map(dest => (
                  <DestinationCard key={dest.id} dest={dest} onLearnMore={openModal} />
                ))
              ) : (
                <div className={styles.messageArea}>
                  No destinations found matching your search.
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Routes View --- */}
        <div style={{ display: activeView === 'routes' ? 'block' : 'none' }}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <input
                type="search"
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                placeholder="Search by name or category (e.g., 'Everest', 'Short Trek')"
                className={styles.searchInput}
              />
              <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          {error && renderError()}
          {isLoading ? renderLoading() : (
            <div className={styles.routeList}>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map(route => {
                  const validImageUrl = isValidUrl(route.imageUrl)
                    ? route.imageUrl
                    : '/images/default-route-fallback.jpg'; 
                  const safeRoute = { ...route, imageUrl: validImageUrl };
                  
                  return (
                    <RouteCard key={route.id} route={safeRoute} />
                  );
                })
              ) : (
                <div className={styles.messageArea}>
                  No routes found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      {isModalOpen && <DetailModal destination={selectedDest} onClose={closeModal} />}
    </>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}