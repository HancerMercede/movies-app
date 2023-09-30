import { MovieCard } from "./MovieCard";
import "../components/MovieList.css";
import { useState } from "react";
import { useEffect } from "react";
import { GetRequest } from "../utils/httpRequest";
import { Loader } from "../utils/Loader";
import { useQuery } from "../hooks/useQuery";
import InfiniteScroll from "react-infinite-scroll-component";

export const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const query = useQuery();
  const search = query.get("search");

  useEffect(() => {
    setIsLoading(true);
    const searchUrl = search
      ? "/search/movie?query=" + search + "&page=" + page
      : "/discover/movie?page=" + page;
    GetRequest(searchUrl)
      .then((data) => {
        setMovies((prevMovies) => prevMovies.concat(data.results));
        setIsLoading(false);
      })
      .catch((err) => console.log(err.message));
  }, [search, page]);

  return (
    <>
      <InfiniteScroll
        dataLength={movies.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={true}
        loader={<Loader />}
      >
        <div>
          <ul className="container">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        </div>
      </InfiniteScroll>
    </>
  );
};
