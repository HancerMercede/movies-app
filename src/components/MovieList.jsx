//import movies from "../database/moviesData.json";
import { MovieCard } from "./MovieCard";
import "../components/MovieList.css";
import { useState } from "react";
import { useEffect } from "react";
import { GetRequest } from "../utils/httpRequest";
import { Loader } from "../utils/loader";
import { useQuery } from "../hooks/useQuery";

export const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const query = useQuery();
  const search = query.get("search");

  useEffect(() => {
    setIsLoading(true);
    const searchUrl = search
      ? "/search/movie?query=" + search
      : "/discover/movie";
    GetRequest(searchUrl)
      .then((data) => {
        setMovies(data.results);
        setIsLoading(false);
      })
      .catch((err) => console.log(err.message));
  }, [search]);

  return (
    <>
      <div>
        <ul className="container">
          {isLoading ? (
            <Loader />
          ) : (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          )}
        </ul>
      </div>
    </>
  );
};
