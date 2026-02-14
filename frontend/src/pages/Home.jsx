import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PopularCities from '../components/PopularCities';
import heroImage from './../../assets/Hero.jpg';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>

        <Header />

        <div className={styles.heroLeft}>
          <div className={styles.heroPanel}>
            <h1 className={styles.heroTitle}>Discover India</h1>
            <p className={styles.heroSub}>
              Curated stays, local flavours, and hidden gems.
            </p>

            <div className={styles.searchWrap}>
              <SearchBar />
            </div> 
          </div>
        </div>

        <div className={styles.heroRight}>
          <img
            src={heroImage}
            alt="Travel"
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroCorner} />
        </div>

      </section>

      <section className={`${styles.cities} page-padding`}>
        <h2 className={styles.sectionTitle}>Popular Cities</h2>
        <PopularCities />
      </section>
    </div>
  );
}
