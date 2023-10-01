import { MovieCard } from "./MovieCard";
import "../components/MovieList.css";
import { Loader } from "../utils/Loader";
import { Empty } from "../components/Empty";
import Proptypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

import { useQuery } from "../hooks/useQuery";

export const MovieList = ({ search }) => {
  const { movies, isLoading, hasNextPage, fetchNextPage } = useQuery(search);

  if (!isLoading && movies.length === 0) return <Empty />;
  return (
    <>
      <InfiniteScroll
        dataLength={movies.length}
        hasMore={hasNextPage || isLoading}
        next={() => fetchNextPage()}
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

MovieList.propTypes = {
  search: Proptypes.string,
};
