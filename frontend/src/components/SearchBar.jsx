import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CITIES } from '../config/cities';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const citySlug = trimmed.toLowerCase().replace(/\s+/g, '-');
    navigate(`/city/${citySlug}`);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.wrapper}>
        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city..."
          className={styles.input}
          list="cities-datalist"
        />
        {/* <datalist id="cities-datalist">
          {CITIES.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist> */}
      </div>
    </form>
  );
}
