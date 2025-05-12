import { useEffect, useState } from 'react';
import styles from './MovieRow.module.css';
import {Link} from 'react-router-dom'

function MovieRow({ title, category }) {
  const [movies, setMovies] = useState([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_API_KEY,
    },
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category ? category : 'now_playing'
      }?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setMovies(res.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.movieRow}>
      <h2>{title ? title : 'Popular Movies'}</h2>
      <div className={styles.card_list}>
        {movies?.map((card, i) => {
          return (
            <Link to={`/player/${card.id}`} className={styles.card} key={i}>
              <img
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                alt="Movie Poster"
              />
              <p>{card.original_title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MovieRow;
