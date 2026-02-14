import { useRef } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HorizontalCardRow.module.css';

export default function HorizontalCardRow({ title, children }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const cardWidth = 280;
    const gap = 20;
    const amount = (cardWidth + gap) * 2;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.wrapper}>
        <button type="button" className={styles.arrow} onClick={() => scroll('left')} aria-label="Previous">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className={styles.scroll} ref={scrollRef}>
          {children}
        </div>
        <button type="button" className={styles.arrow} onClick={() => scroll('right')} aria-label="Next">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
}
