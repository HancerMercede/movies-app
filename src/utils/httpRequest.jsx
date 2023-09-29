const endpoint = "https://api.themoviedb.org/3";

export const GetRequest = (path) => {
  return fetch(`${endpoint}${path}`, {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTNlZTc3N2RiN2MxOTNjMWVjZjg0NjZmZDc5NTM0ZCIsInN1YiI6IjY1MTQ1OTcxOTNiZDY5MDEzOGZiZGJkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d9Qb8ENLRAk5DWDTVyxgQ34Cq9B3mXu8-WoZH7BtpCE",
      "content-type": "application/json; charset=utf-8",
    },
  }).then((result) => result.json());
};
