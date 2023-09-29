import styles from "../components/MovieCard.module.css";
import Proptypes from "prop-types";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
  return (
    <li className={styles.MovieCard}>
      <Link to={`/movies/${movie.id}`}>
        <img
          width={230}
          height={345}
          src={imageUrl}
          alt={movie.title}
          className={styles.MovieCardImage}
        />
      </Link>
      <div>{movie.title}</div>
    </li>
  );
};

MovieCard.propTypes = {
  movie: Proptypes.object.isRequired,
};
