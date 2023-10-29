import { useEffect, useState } from "react";
import styles from "../components/MovieDetails.module.css";
import { useParams } from "react-router-dom";
import { GetRequest } from "../utils/httpRequest";
import { Loader } from "../utils/Loader.jsx";
import { getMovieImg } from "../utils/getMovieImg";

export const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    GetRequest(`/movie/${id}`)
      .then((data) => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err.message));
  }, [id]);

  if (isLoading) return <Loader />;

  const imageUrl = getMovieImg(movie.poster_path, 500);

  return (
    <div className={`${styles.detailsContainer} ${styles.movieDetails}`}>
      <img
        className={`${styles.detailsImage}  ${styles.col}`}
        src={imageUrl}
        alt={movie.title}
      />
      <div className={styles.col}>
        <p>
          <b>Title: </b> {movie.title}
        </p>
        {
          <p>
            <strong>Genres:</strong>{" "}
            {movie ? (
              movie.genres.map((g) => g.name).join(", ")
            ) : (
              <p>
                <strong>Genders: </strong>
              </p>
            )}
            ;
          </p>
        }
        <p>
          <strong>Sipnosis: </strong> {movie.overview}
        </p>
        <p>
          <strong>Release Date: </strong> {movie.release_date}
        </p>
        <p>
          <strong>Votes: </strong>
          {movie.vote_count}
        </p>
        <p>
          <strong>Popularity: </strong>
          {movie.popularity}
        </p>
      </div>
    </div>
  );
};
