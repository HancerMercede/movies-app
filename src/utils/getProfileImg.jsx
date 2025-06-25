import placeholder from "../Images/no-photo.jpg";

export const getProfileImg = (path, width) => {
  return path ? `https://image.tmdb.org/t/p/w${width}${path}` : placeholder;
};

