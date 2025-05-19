import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/search_icon.svg';
import bellIcon from '../../assets/bell_icon.svg';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountBoxIcon from '@mui/icons-material/AccountBoxOutlined';
import { useEffect, useRef } from 'react';
import { logout } from '../../../firebase/firebase';
import { toast } from 'react-toastify';

function Navbar() {
  const navRef = useRef();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 80) {
        navRef.current?.classList.add(styles.nav_dark);
      } else {
        navRef.current?.classList.remove(styles.nav_dark);
      }
    });
  }, []);

  return (
    <div ref={navRef} className={styles.navbar}>
      <div className={styles.leftCon}>
        <img src={logo} alt="Logo" />
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>

      <div className={styles.rightCon}>
        <img src={searchIcon} alt="Search Icon" className={styles.icons} />
        <img src={bellIcon} alt="Bell Icon" className={styles.icons} />

        <div className={styles.profileCon}>
          <AccountBoxIcon className={styles.profile} />
          <ArrowDropDownIcon />
          {/* Logout text */}
          <div className={styles.dropdown}>
            <p onClick={() => logout().then(() => {
      toast.success('Signed out!');
    })}>Sign Out</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
