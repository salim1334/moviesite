import styles from './Main.module.css';
import heroBanner from '../../assets/hero_banner.jpg';
import playIcon from '../../assets/play_icon.png';
import infoIcon from '../../assets/info_icon.png';
import MovieRow from '../MovieRow/MovieRow';

function Main() {
  return (
    <>
      <div className={styles.hero}>
        <img src={heroBanner} alt="Hero Banner" className={styles.banner_img} />

        <div className={styles.hero_caption}>
          <h2>Viking Wolf</h2>
          <p>
            After witnessing a grotesque murder at a party in her new town, a
            teenager starts having strange visions and bizarre desires.
          </p>
          <div className={styles.hero_btns}>
            <button className={styles.btn}>
              <img src={playIcon} alt="Play Icon" />
              Play
            </button>
            <button className={styles.btn + ' ' + styles.dark_btn}>
              <img src={infoIcon} alt="Info Icon" />
              More Info
            </button>
          </div>
          <MovieRow />
        </div>
      </div>

      <div className={styles.more_cards}>
        <MovieRow title="Blockbuster Movies" category="top_rated" />
        <MovieRow title="Only on Netflix" category="popular" />
        <MovieRow title="Upcoming" category="upcoming" />
        <MovieRow title="Top Pics for you" category="now_playing" />
      </div>
    </>
  );
}

export default Main;
