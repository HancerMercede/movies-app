import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { GetRequest } from "../utils/httpRequest.jsx";
import { getProfileImg } from "../utils/getProfileImg";
import { LoaderComponent } from "../utils/loaderComponent.jsx";
import styles from "./Credits.module.css";
import "animate.css";

const fetchCredits = (movieId) => {
  return GetRequest(`/movie/${movieId}/credits`);
};

export const Credits = ({ movieId }) => {
  const { data, isLoading, isError } = useQuery(["credits", movieId], () =>
    fetchCredits(movieId)
  );

  if (isLoading) return <LoaderComponent />;
  if (isError || !data)
    return (
      <div className={styles.error}>
        Unable to load credits. Please try again later.
      </div>
    );

  const { cast, crew } = data || { cast: [], crew: [] };
  const keyCrew = crew.filter((c) =>
    [
      "Director",
      "Producer",
      "Executive Producer",
      "Screenplay",
      "Writer",
      "Music",
    ].includes(c.job)
  );

  return (
    <section className={`${styles.credits} animate__animated animate__fadeIn`}>
      <h2 className={styles.sectionTitle}>Cast</h2>
      <div className={styles.castSection}>
        {cast.slice(0, 12).map((member) => (
          <div key={member.cast_id} className={styles.castCard}>
            <img
              src={getProfileImg(member.profile_path, 185)}
              alt={member.name}
              className={styles.profileImage}
            />
            <p>{member.name}</p>
            <p>
              <small>{member.character}</small>
            </p>
          </div>
        ))}
      </div>

      {/* <h2 className={styles.sectionTitle}>Crew</h2>
            <ul className={styles.crewSection}>
                {keyCrew.map(member => (
                    <li key={member.credit_id}>
                        <strong>{member.job}:</strong> {member.name}
                    </li>
                ))}
            </ul> */}
    </section>
  );
};

Credits.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
