const endpoint = "https://api.themoviedb.org/3";

export const GetRequest = (path) => {
  return fetch(`${endpoint}${path}`, {
    headers: {
      Authorization:
        // eslint-disable-next-line no-undef
        `Bearer ${process.env.TOKEN}`,
      "content-type": "application/json; charset=utf-8",
    },
  }).then((result) => result.json());
};
