"use client";

import { useState, useEffect } from 'react';
import styles from './WeatherModal.module.css';

const DEFAULT_CITIES = ['Kathmandu', 'Pokhara', 'namche bazaar'];

export default function WeatherModal({ onClose }) {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchCity, setSearchCity] = useState('');
  const [searchError, setSearchError] = useState(null);

  const fetchCities = async (cities) => {
    setLoading(true);
    const promises = cities.map(city => 
      fetch(`/api/weather?city=${city}`).then(res => res.json())
    );
    
    const results = await Promise.all(promises);
    const validResults = results.filter(data => !data.error);
    
    setWeatherList(prev => {
      const newCities = validResults.filter(
        newCity => !prev.some(existing => existing.city === newCity.city)
      );
      return [...newCities, ...prev];
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchCities(DEFAULT_CITIES);
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;

    setSearchError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/weather?city=${searchCity}`);
      const data = await res.json();

      if (data.error) {
        setSearchError("City not found. Please try again.");
      } else {
        setWeatherList(prev => {
            const filtered = prev.filter(item => item.city !== data.city);
            return [data, ...filtered];
        });
        setSearchCity(''); 
      }
    } catch (err) {
      setSearchError("Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Current Weather</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.body}>
          <form className={styles.searchForm} onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input
            className={styles.searchInput} 
              type="text" 
              placeholder="Search city (e.g. Dharan)" 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button 
            className={styles.addButton}
              type="submit"
            >
              Add
            </button>
          </form>
          
          {searchError && <p style={{color: 'red', marginTop: '-10px', marginBottom: '10px'}}>{searchError}</p>}

          {/* Weather Grid */}
          <div className={styles.grid}>
            {weatherList.map((data, index) => (
              <div key={index} className={styles.card}>
                {data.error ? (
              <span style={{color:'red', fontSize:'0.9rem'}}>Error: {CITIES[index]}</span>
            ) : (
              <>
                <img 
                  src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} 
                  alt={data.condition} 
                />
                <div className={styles.info}>
                  <h4>{data.city}</h4>
                  <p className={styles.temp}>{data.temp}°C</p>
                  <p className={styles.condition}>{data.condition}</p>
                </div>
              </>
              )}
                
                
              </div>
            ))}
          </div>
          
          {loading && <p style={{textAlign: 'center', marginTop: '20px'}}>Loading...</p>}
        </div>
      </div>
    </div>
  );
}