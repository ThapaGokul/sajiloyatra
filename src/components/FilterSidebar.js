// /src/components/FilterSidebar.js
import styles from './FilterSideBar.module.css';

export default function FilterSidebar({ activeFilters, onFilterChange, availableAreas, onClose }) {
  
  const handleCheckboxChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  return (
    <aside className={styles.sidebar}>
      <h3>Filters</h3>
      <div className={styles.filterGroup}>
        <h4>Area</h4>
        {availableAreas.length > 0 ? (
          availableAreas.map((area) => (
            <div className={styles.filterOption} key={area}>
              <input 
                type="checkbox" 
                id={`area-${area.replace(/\s+/g, '-')}`}
                name="area"
                value={area}
                checked={activeFilters.area.includes(area)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`area-${area.replace(/\s+/g, '-')}`}>{area}</label>
            </div>
          ))
        ) : (
          <p className={styles.loadingFilters}>Loading areas...</p>
        )}
        
      </div>
      <button className={styles.viewResultsBtn} onClick={onClose}>
        View Results
      </button>
    </aside>
  );
}