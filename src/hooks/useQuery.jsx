import { useInfiniteQuery } from "@tanstack/react-query";
import { GetRequest } from "../utils/httpRequest";

export const useQuery = (search) => {
  const result = useInfiniteQuery(
    ["movies", search],
    () => {
      const searchUrl = search
        ? "/search/movie?query=" + search + "&page=" + 1
        : "/discover/movie?page=" + 1;
      return GetRequest(searchUrl);
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page === lastPage.total_pages) return false;
        return lastPage + 1;
      },
    }
  );

  const movies =
    result.data?.pages.reduce(
      (prevMovies, page) => prevMovies.concat(page.results),
      []
    ) ?? [];
  return { ...result, movies: movies };
};
