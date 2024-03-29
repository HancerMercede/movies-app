import { MovieCard } from "./MovieCard";
import "../components/MovieList.css";
import { useState, useEffect } from "react";
import { GetRequest } from "../utils/httpRequest";
import { Loader } from "../utils/Loader";
import { Empty } from "../components/Empty";
import Proptypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import "animate.css";

export const MovieList = ({ search }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, sethasMore] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const searchUrl = search
      ? "/search/movie?query=" + search + "&page=" + page
      : "/discover/movie?page=" + page;
    GetRequest(searchUrl)
      .then((data) => {
        setMovies((prevMovies) => prevMovies.concat(data.results));
        sethasMore(data.page < data.total_pages);
        setIsLoading(false);
      })
      .catch((err) => console.log(err.message));
  }, [search, page]);

  if (!isLoading && movies.length === 0) return <Empty />;

  return (
    <>
      <InfiniteScroll
        dataLength={movies.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
        loader={<Loader />}
      >
        <div>
          <ul className="container animate__animated animate__fadeIn">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        </div>
      </InfiniteScroll>
    </>
  );
};

MovieList.propTypes = {
  search: Proptypes.string,
};
