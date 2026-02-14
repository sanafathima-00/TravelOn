import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from './../../assets/logo.png';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoWrap}>
        <img src={logo} alt="TravelOn Logo" className={styles.logoImg} />
        <span>TravelOn</span>
      </Link>

      {user ? (
        <div className={styles.userWrap}>
          <span className={styles.userName}>{user.name}</span>
          <button
            type="button"
            className={styles.loginBtn}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>
      )}
    </header>
  );
}
