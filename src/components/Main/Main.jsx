import styles from './Main.module.css';
import playIcon from '../../assets/play_icon.png';
import infoIcon from '../../assets/info_icon.png';
import MovieRow from '../MovieRow/MovieRow';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [videoKey, setVideoKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgNotFound, setImgNotFound] = useState(false);
  const playerRef = useRef(null);
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_API_KEY,
    },
  };

  useEffect(() => {
    // Check session storage for existing movie and its timestamp
    const savedMovie = JSON.parse(sessionStorage.getItem('featuredMovie'));
    const now = Date.now();
    const oneHour = 30 * 60 * 1000; // 1 hour in milliseconds

    // Use saved movie if it exists and isn't expired
    if (savedMovie && now - savedMovie.timestamp < oneHour) {
      setFeaturedMovie(savedMovie.movie);
      return;
    }

    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.results.length) {
          const randomMovie =
            res.results[Math.floor(Math.random() * res.results.length)];
          if (!randomMovie.backdrop_path) setImgNotFound(true);
          setFeaturedMovie(randomMovie);
          // Save with current timestamp
          sessionStorage.setItem(
            'featuredMovie',
            JSON.stringify({
              movie: randomMovie,
              timestamp: now,
            })
          );
        }
      })
      .catch((err) => console.error(err));
    setImgNotFound(false);
  }, [imgNotFound]);

  const handleClick = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        options
      );
      const data = await res.json();
      const trailer = data.results.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer'
      );
      if (trailer) {
        setVideoKey(trailer.key);
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

  const handleMoreInfo = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('More Info clicked, movieId:', id); // Debug log
    if (id) {
      navigate(`/movie/${id}`);
    } else {
      console.warn('No movieId provided');
    }
  };

  const src = featuredMovie?.backdrop_path;
  const para = featuredMovie?.overview;
  const title = featuredMovie?.original_title;
  const movieId = featuredMovie?.id;

  return (
    <>
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
          <div className={styles.hero_btns}>
            <button
              className={styles.btn}
              onClick={() => movieId && handleClick(movieId)}
              disabled={!movieId}
              aria-label={`Play trailer for ${title || 'movie'}`}
            >
              <img src={playIcon} alt="Play Icon" />
              Play
            </button>
            <button
              className={`${styles.btn} ${styles.dark_btn}`}
              onClick={(e) => 
                handleMoreInfo(e, movieId)
              }
              disabled={!movieId}
              aria-label={`More information about ${title || 'movie'}`}
            >
              <img src={infoIcon} alt="Info Icon" />
              More Info
            </button>
          </div>
          <MovieRow isPoster={true} />
        </div>
      </div>
      <div className={styles.more_cards}>
        {isLoading && (
          <div className="movieLoading">
            <div className="movieSpinner"></div>
            <p>Loading trailer...</p>
          </div>
        )}
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
        <MovieRow title="Blockbuster Movies" category="top_rated" page={1} />
        <MovieRow title="Only on Netflix" category="popular" page={2} />
        <MovieRow title="Upcoming" category="upcoming" page={3} />
        <MovieRow title="Top Picks for you" category="now_playing" page={4} />
      </div>
    </>
  );
}

export default Main;
