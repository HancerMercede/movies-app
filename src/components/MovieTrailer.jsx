import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { fetchTrailers } from "../utils/FetchTrailers.js";
import { LoaderComponent } from "../utils/loaderComponent.jsx";
import styles from "./MovieTrailer.module.css";
import "animate.css";

export const MovieTrailer = ({ movieId }) => {
  const { data, isLoading, isError } = useQuery(["trailers", movieId], () =>
    fetchTrailers(movieId),
  );

  if (isLoading) return <LoaderComponent />;

  if (isError || !data)
    return (
      <div className={styles.error}>
        Unable to load trailer. Please try again later.
      </div>
    );

  // Filter for official trailers (preferably YouTube)
  const trailers = data.results.filter(
    (video) =>
      (video.type.toLowerCase() === "trailer" ||
        video.type.toLowerCase() === "teaser") &&
      video.site.toLowerCase() === "youtube" &&
      video.official,
  );

  // If no trailers are found
  if (trailers.length === 0) {
    return (
      <div className={styles.noTrailer}>
        No official trailers available for this movie.
      </div>
    );
  }

  // Use the first trailer in the filtered list
  const trailer = trailers[0];
  const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`;

  return (
    <section
      className={`${styles.trailerContainer} animate__animated animate__fadeIn`}
    >
      <h2 className={styles.trailerTitle}>Official Trailer</h2>
      <div className={styles.videoWrapper}>
        <iframe
          src={youtubeUrl}
          title={trailer.name}
          className={styles.trailerFrame}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

MovieTrailer.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
