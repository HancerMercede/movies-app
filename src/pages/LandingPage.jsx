import { MovieList } from "../components/MovieList";
import { Search } from "../components/Search";
import { useDebounce } from "../hooks/useDebounce";
import { useQuery } from "../hooks/useQuery";

/*Note: herewe pass the search as a key to reutilized the components that we already has and pass the search by props to used in the child component */
export const LandingPage = () => {
  const query = useQuery();
  const search = query.get("search");

  const debouncedSearch = useDebounce(search, 300);
  return (
    <>
      <Search />
      <MovieList key={debouncedSearch} search={debouncedSearch} />
    </>
  );
};
