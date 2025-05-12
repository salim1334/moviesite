import cards_data from '../../assets/cards/Cards_data';
import styles from './MovieRow.module.css';

function MovieRow({title, category}) {
  return (
    <div className={styles.movieRow}>
      <h2>{title ? title : 'Popular Movies'}</h2>
        <div className={styles.card_list}>
          {cards_data?.map((card, i) => {
            return (
              <div className={styles.card} key={i}>
                <img
                  src={card.image}
                  alt="Movie Poster"
                />
                <p>{card.name}</p>
              </div>
            );
          })}
        </div>
    </div>
  );
}

export default MovieRow;
