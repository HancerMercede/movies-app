import styles from "./Search.module.css";
import { SearchIcon } from "../utils/SearchIcon";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";

export const Search = () => {
  const query = useQuery();
  const search = query.get("search");

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSubmit}>
      <div className={styles.searchBox}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search movies..."
          aria-label="Search movies..."
          value={search ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            history("/?search=" + value);
          }}
        />
        <button className={styles.searchButton} type="submit">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
};
