const endpoint = "https://api.themoviedb.org/3";

export const GetRequest = (path) => {
  console.log(import.meta.env.VITE_TMDB_TOKEN);
  return fetch(`${endpoint}${path}`, {
    headers: {
      Authorization:
        // eslint-disable-next-line no-undef
        `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      "content-type": "application/json; charset=utf-8",
    },
  }).then((result) => result.json());
};
