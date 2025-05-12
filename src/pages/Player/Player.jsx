import styles from './Player.module.css'
import backArrowIcon from '../../assets/back_arrow_icon.png';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODNjZTQ4ZDExMTE1YzEzZDQwOGUxYTc4ZWVkYThlYSIsIm5iZiI6MTc0Njg2MDgxOC4xMzUsInN1YiI6IjY4MWVmYjEyYmY2YzIwNTQ4MTdlNzE4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RD21-v3HZLMqLTlvlklDakVog0612DUKjnN2DrWf3MU',
    },
  };

  useEffect(() => { 
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((res) => setMovie(res.results[0]))
      .catch((err) => console.error(err));
  }, [])

  return (
    <div className={styles.player}>
      <img src={backArrowIcon} alt="Back Arrow" onClick={() => navigate(-2)} />
      <iframe
        width="90%"
        height="90%"
        src={`https://www.youtube.com/embed/${movie.key}`}
        title="trailer"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <div className={styles.player_info}>
        <p>{movie.published_at?.slice(0, 10)}</p>
        <p>{movie.name}</p>
        <p>{movie.type}</p>
      </div>
    </div>
  );
}

export default Player