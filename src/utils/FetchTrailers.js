import { GetRequest } from "./httpRequest";
export const fetchTrailers = (movieId) => {
  return GetRequest(`/movie/${movieId}/videos`);
};
