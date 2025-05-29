import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MovieDetails.module.css';
import {
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaArrowLeft,
  FaPlay,
} from 'react-icons/fa';
import { MdOutlineTheaters } from 'react-icons/md';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_API_KEY,
    },
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch movie details
        const [movieRes, castRes, videosRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
            options
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
            options
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
            options
          ),
        ]);

        if (!movieRes.ok) throw new Error('Failed to fetch movie details');
        if (!castRes.ok) throw new Error('Failed to fetch cast');
        if (!videosRes.ok) throw new Error('Failed to fetch videos');

        const [movieData, castData, videosData] = await Promise.all([
          movieRes.json(),
          castRes.json(),
          videosRes.json(),
        ]);

        // Find trailer
        const trailer = videosData.results.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer'
        );

        setMovie(movieData);
        setCast(castData.cast.slice(0, 8)); // Show more cast members
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading movie magic...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops! Something went wrong</h2>
        <p>{error || "We couldn't find this movie."}</p>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section with Backdrop */}
      <div className={styles.heroSection}>
        {movie.backdrop_path && (
          <div className={styles.backdropContainer}>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={`${movie.title} backdrop`}
              className={styles.backdropImage}
            />
            <div className={styles.backdropOverlay}></div>
          </div>
        )}

        <button className={styles.backButton} onClick={() => navigate('/')}>
          <FaArrowLeft /> Back
        </button>

        <div className={styles.heroContent}>
          <div className={styles.posterContainer}>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className={styles.posterImage}
              />
            )}
            {trailerKey && (
              <button
                className={styles.trailerButton}
                onClick={() => setShowTrailer(true)}
              >
                <FaPlay /> Watch Trailer
              </button>
            )}
          </div>

          <div className={styles.movieInfo}>
            <h1 className={styles.movieTitle}>{movie.title}</h1>
            <p className={styles.tagline}>{movie.tagline}</p>

            <div className={styles.metaData}>
              <div className={styles.metaItem}>
                <FaStar className={styles.metaIcon} />
                <span>{movie.vote_average?.toFixed(1)}/10</span>
              </div>
              <div className={styles.metaItem}>
                <FaClock className={styles.metaIcon} />
                <span>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              </div>
              <div className={styles.metaItem}>
                <FaCalendarAlt className={styles.metaIcon} />
                <span>{movie.release_date?.split('-')[0]}</span>
              </div>
              <div className={styles.metaItem}>
                <MdOutlineTheaters className={styles.metaIcon} />
                <span>{movie.status}</span>
              </div>
            </div>

            <div className={styles.genres}>
              {movie.genres?.map((genre) => (
                <span key={genre.id} className={styles.genreTag}>
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.overview}>{movie.overview}</p>
        </section>

        {cast.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cast</h2>
            <div className={styles.castGrid}>
              {cast.map((person) => (
                <div key={person.id} className={styles.castCard}>
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                      alt={person.name}
                      className={styles.castImage}
                    />
                  ) : (
                    <div className={styles.castPlaceholder}></div>
                  )}
                  <div className={styles.castInfo}>
                    <h3>{person.name}</h3>
                    <p>{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {movie.production_companies?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Production</h2>
            <div className={styles.companyGrid}>
              {movie.production_companies
                .filter((company) => company.logo_path)
                .map((company) => (
                  <div key={company.id} className={styles.companyCard}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                      className={styles.companyLogo}
                    />
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className={styles.trailerModal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeModal}
              onClick={() => setShowTrailer(false)}
            >
              &times;
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
