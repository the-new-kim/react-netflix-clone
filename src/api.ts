const API_KEY = "cf13f93b5d8390312d36ffb98bb38259";
const BASE_URL = "https://api.themoviedb.org/3/";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_URL}movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}
