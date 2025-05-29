// Import hooks and styles
import { useEffect, useState, useRef } from 'react';
import styles from './MovieRow.module.css';

function MovieRow({ title, category, isPoster, page = 1 }) {
  // State to store movies for this row
  const [movies, setMovies] = useState([]);

  // State to track currently selected movie for trailer
  const [selectedMovie, setSelectedMovie] = useState(null);

  // State to store the YouTube video key of the trailer
  const [videoKey, setVideoKey] = useState('');

  // State to show loading indicator while fetching trailer
  const [isLoading, setIsLoading] = useState(false);

  // Ref used to scroll to the trailer player
  const playerRef = useRef(null);

  // Authorization headers for TMDB API requests
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_API_KEY,
    },
  };

  // Fetch movies when the component mounts
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category ? category : 'now_playing'
      }?language=en-US&page=${page}`,
      options
    )
      .then((res) => res.json())
      .then((res) => setMovies(res.results)) // Set the fetched movie list
      .catch((err) => console.error(err));
  }, [category, page]);

  // Handle user click to play a movie trailer
  const handleClick = async (id) => {
    // If same movie is clicked again or if it's just a poster row, toggle off
    if (selectedMovie === id || isPoster) {
      setSelectedMovie(null);
      setVideoKey('');
      return;
    }

    // Reset any previously selected trailer
    setSelectedMovie(null);
    setVideoKey('');
    setIsLoading(true);

    // Delay to show loader before fetching trailer
    setTimeout(async () => {
      try {
        // Fetch trailer videos for selected movie
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          options
        );
        const data = await res.json();

        // Find the trailer hosted on YouTube
        const trailer = data.results.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer'
        );

        if (trailer) {
          setSelectedMovie(id); // Set current movie ID
          setVideoKey(trailer.key); // Set video key for embed

          // Scroll to video player after slight delay
          setTimeout(() => {
            playerRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          alert('No trailer found for this movie.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  };

  return (
    <div className={styles.movieRow}>
      {/* Section title */}
      <h2>{title ? title : 'Popular Movies'}</h2>

      {/* Display list of movie cards */}
      <div className={styles.card_list}>
        {movies?.map(
          (card) =>
            card.backdrop_path && (
              <div
                className={styles.card}
                key={card.id}
                onClick={() => handleClick(card.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${
                    isPoster ? card.poster_path : card.backdrop_path
                  }`}
                  alt="Movie Poster"
                  className={`row__poster ${
                    isPoster ? 'row__posterLarge' : ''
                  }`}
                />
                <p>{card.original_title}</p>
              </div>
            )
        )}
      </div>

      {/* Show loading spinner while trailer is loading */}
      {isLoading && (
        <div className="movieLoading">
          <div className="movieSpinner"></div>
          <p>Loading trailer...</p>
        </div>
      )}

      {/* Embed YouTube trailer video if available */}
      {videoKey && !isLoading && (
        <div ref={playerRef} className="embedMovie">
          <button
            onClick={() => {
              setSelectedMovie(null);
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
    </div>
  );
}

export default MovieRow;
