// Import CSS styles and required assets
import styles from './Main.module.css';
import playIcon from '../../assets/play_icon.png';
import infoIcon from '../../assets/info_icon.png';

// Import dependencies and components
import MovieRow from '../MovieRow/MovieRow';
import { useEffect, useRef, useState } from 'react';

function Main() {
  // State for the featured movie on the hero banner
  const [featuredMovie, setFeaturedMovie] = useState(null);

  // State to hold the YouTube trailer video key
  const [videoKey, setVideoKey] = useState('');

  // State to handle loading state when trailer is being fetched
  const [isLoading, setIsLoading] = useState(false);

  // Ref for scrolling to the trailer player
  const playerRef = useRef(null);

  // Options for the API request including authorization headers
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_API_KEY,
    },
  };

  // Fetch list of currently playing movies when the component mounts
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        // Randomly select one movie to feature in the hero section
        if (res.results.length) {
          const randomMovie =
            res.results[Math.floor(Math.random() * res.results.length)];
          setFeaturedMovie(randomMovie);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle click on "Play" button: fetch movie trailer by movie ID
  const handleClick = async (id) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        options
      );
      const data = await res.json();

      // Find YouTube trailer in the video results
      const trailer = data.results.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer'
      );

      if (trailer) {
        setVideoKey(trailer.key); // Set the video key for the iframe
        // Scroll smoothly to the player section after a small delay
        setTimeout(() => {
          playerRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        alert('No trailer found for this movie.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract data from featured movie for display
  const src = featuredMovie?.backdrop_path;
  const para = featuredMovie?.overview;
  const title = featuredMovie?.original_title;
  const movieId = featuredMovie?.id;

  return (
    <>
      {/* Hero section with background image and movie info */}
      <div className={styles.hero}>
        {src && (
          <img
            src={`https://image.tmdb.org/t/p/original${src}`}
            alt="Hero Banner"
            className={styles.banner_img}
          />
        )}

        <div className={styles.hero_caption}>
          <h1>{title || 'Loading...'}</h1>
          <p className={styles.bannerDesc}>{para || ''}</p>

          {/* Action buttons: Play and More Info */}
          <div className={styles.hero_btns}>
            <button
              className={styles.btn}
              onClick={() => movieId && handleClick(movieId)}
              disabled={!movieId}
            >
              <img src={playIcon} alt="Play Icon" />
              Play
            </button>

            <button className={`${styles.btn} ${styles.dark_btn}`}>
              <img src={infoIcon} alt="Info Icon" />
              More Info
            </button>
          </div>

          {/* Row of movies shown under the hero banner */}
          <MovieRow isPoster={true} />
        </div>
      </div>

      {/* Additional content including trailer player and more movie rows */}
      <div className={styles.more_cards}>
        {/* Show loader when trailer is being fetched */}
        {isLoading && (
          <div className="movieLoading">
            <div className="movieSpinner"></div>
            <p>Loading trailer...</p>
          </div>
        )}

        {/* Show embedded YouTube trailer when videoKey is set */}
        {videoKey && !isLoading && (
          <div ref={playerRef} className="embedMovie">
            <button
              onClick={() => {
                setVideoKey('');
              }}
            ></button>
            <iframe
              width="100%"
              height="350"
              src={`https://www.youtube.com/embed/${videoKey}`}
              title="trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Display multiple movie rows by category */}
        <MovieRow title="Blockbuster Movies" category="top_rated" />
        <MovieRow title="Only on Netflix" category="popular" />
        <MovieRow title="Upcoming" category="upcoming" />
        <MovieRow title="Top Picks for you" category="now_playing" />
      </div>
    </>
  );
}

export default Main;
