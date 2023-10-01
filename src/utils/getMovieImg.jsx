import placeholder from "../Images/no-photo.jpg";

export const getMovieImg = (path, width) => {
  return path ? `https://image.tmdb.org/t/p/w${width}${path}` : placeholder;
};
