const API_KEY = "cf13f93b5d8390312d36ffb98bb38259";
const BASE_URL = "https://api.themoviedb.org/3/";

interface IMedia {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
}

export interface IMovie extends IMedia {
  title: string;
}

export interface ITvShow extends IMedia {
  name: string;
}

export interface IGetMoviesResult {
  dates?: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies(category: string) {
  return fetch(
    `${BASE_URL}movie/${category}?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

interface IGenres {
  id: number;
  name: string;
}

export interface IGetMovieDetals {
  backdrop_path: string;
  genres: IGenres[];
  id: number;
  title: string;
  overview: string;
  runtime: number;
}

export function getMovieDetails(id: string | number) {
  return fetch(`${BASE_URL}movie/${id}?api_key=${API_KEY}&language=en-US`).then(
    (response) => response.json()
  );
}

export function getSimilarMovies(id: string | number) {
  return fetch(
    `${BASE_URL}movie/${id}/similar?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

interface IVideo {
  key: string;
  site: string;
  type: string;
}

export interface IGetVideosResult {
  id: number;
  results: IVideo[];
}

export function getVideos(id: string | number) {
  return fetch(
    `${BASE_URL}movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

export interface ISearchResult {
  results: IMovie[];
}

export function searchContents(keyword: string) {
  return fetch(
    `${BASE_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}
