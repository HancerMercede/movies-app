import styles from "../components/MovieDetails.module.css";
import { useParams } from "react-router-dom";
import { GetRequest } from "../utils/httpRequest";
import { Loader } from "../utils/Loader.jsx";
import { getMovieImg } from "../utils/getMovieImg";
import { useQuery } from "@tanstack/react-query";
import "animate.css";

export const MovieDetails = () => {
  const { id } = useParams();

  // data have an alias as movie
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => GetRequest(`/movie/${id}`),
  });

  if (isLoading) return <Loader />;

  const imageUrl = getMovieImg(movie.poster_path, 500);

  return (
    <div
      className={`${styles.detailsContainer} ${styles.movieDetails} animate__animated animate__fadeIn`}
    >
      <img
        className={`${styles.detailsImage}  ${styles.col}`}
        src={imageUrl}
        alt={movie.title}
      />
      <div className={`${styles.col}`}>
        <p>
          <b>Title: </b> {movie.title}
        </p>
        {
          <p>
            <strong>Genres: </strong>
            {movie ? (
              movie.genres.map((g) => g.name).join(", ")
            ) : (
              <p>
                <strong>Genders: </strong>
              </p>
            )}
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

        {
          <p>
            <strong>Countries: </strong>
            {movie ? (
              movie.production_countries.map((c) => c.name).join(", ")
            ) : (
              <p>
                <strong>Countries: </strong>
              </p>
            )}
          </p>
        }
      </div>
    </div>
  );
};
