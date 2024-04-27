import styles from "../components/MovieCard.module.css";
import Proptypes from "prop-types";
import { Link } from "react-router-dom";
import { getMovieImg } from "../utils/getMovieImg";
import "animate.css";

export const MovieCard = ({ movie }) => {
  const imageUrl = getMovieImg(movie.poster_path, 300);
  return (
    <li className={`${styles.MovieCard} animate__animated animate__fadeIn`}>
      <Link to={`/movies/${movie.id}`}>
        <img
          width={230}
          height={345}
          src={imageUrl}
          alt={movie.title}
          className={styles.MovieCardImage}
        />
      </Link>
      <div>
        <strong>{movie.title}</strong>
      </div>
    </li>
  );
};

MovieCard.propTypes = {
  movie: Proptypes.object.isRequired,
};
