import { GetRequest } from "./httpRequest";

export const fetchCredits = (movieId) => {
  return GetRequest(`/movie/${movieId}/credits`);
};
