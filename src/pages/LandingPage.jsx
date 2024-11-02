import { MovieList } from "../components/MovieList";
import { Search } from "../components/Search";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

/*Note: here we pass the search as a key to re-utilize the components that we already has and pass the search by props to used in the child component */
export const LandingPage = () => {
  const [query] = useSearchParams();
  const search = query.get("search");

  const debouncedSearch = useDebounce(search, 300);
  return (
    <>
      <Search />
      <MovieList key={debouncedSearch} search={debouncedSearch} />
    </>
  );
};
