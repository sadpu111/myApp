const API_KEY = "833228a23373ddc804c04843b6c4434a";
const BASE_URL = "https://api.themoviedb.org/3"

export interface IGetMoviesResult {
  page: number;
  results: IGetMovieDetails[];
  total_pages: number;
  total_results: number;
};
export interface IGetMovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: [
    {
      id: number;
      logo_path: string;
      name: string;
      origin_country: string;
    }
  ];
  production_countries: [
    {
      iso_3166_1: string;
      name: string;
    }
  ];
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
export interface IGetMovieCredit {
  id: number;
  cast: [
    {
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string;
      cast_id: number;
      character: string;
      credit_id: string;
      order: number;
    }
  ];
}

export function getMovies(status: string) {
  return fetch(`${BASE_URL}/movie/${status}?api_key=${API_KEY}&language=en-US`).then((response) => response.json());
};

export function getMovieDetails(movieId: string | undefined) {
  return fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`).then((response) => response.json());
};

export function getMovieCredit(movieId: string | undefined) {
  return fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`).then(
    (response) => response.json()
  );
};


export interface IGetTvShowsResult {
  page: number;
  results: [
    {
      poster_path: string;
      popularity: number;
      id: number;
      backdrop_path: string;
      vote_average: number;
      overview: string;
      first_air_date: string;
      origin_country: [string];
      genre_ids: [number];
      original_language: string;
      vote_count: number;
      name: string;
      original_name: string;
    }
  ];
};

export interface IGetTvShowDetails {
  backdrop_path: string;
  created_by: [
    {
      id: number;
      credit_id: string;
      name: string;
      gender: number;
      profile_path: string;
    }
  ];
  episode_run_time: number[];
  first_air_date: string;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: [string];
  last_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  };
  name: string;
  networks: [
    {
      name: string;
      id: number;
      logo_path: string;
      origin_country: string;
    }
  ];
  next_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  };
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: [string];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: [
    {
      id: number;
      logo_path: string;
      name: string;
      origin_country: string;
    }
  ];
  production_countries: [
    {
      iso_3166_1: string;
      name: string;
    }
  ];
  seasons: [
    {
      air_date: string;
      episode_count: number;
      id: number;
      name: string;
      overview: string;
      poster_path: string;
      season_number: number;
    }
  ];
  spoken_languages: [
    {
      english_name: string;
      iso_639_1: string;
      name: string;
    }
  ];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
};

export interface IGetTvShowCredit {
  cast: [
    {
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string;
      character: string;
      credit_id: string;
      order: number;
    }
  ];
  crew: [
    {
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: null;
      credit_id: string;
      department: string;
      job: string;
    }
  ];
  id: number;
};
export function getTvShows(status: string) {
  return fetch(`${BASE_URL}/tv/${status}?api_key=${API_KEY}&language=en-US`).then(
    (response) => response.json()
  );
}
export function getTvShowDetails(tvShowId: string | undefined) {
  return fetch(`${BASE_URL}/tv/${tvShowId}?api_key=${API_KEY}&language=en-US`).then((response) => response.json());
};

export function getTvShowCredit(tvShowId: string | undefined) {
  return fetch(`${BASE_URL}/tv/${tvShowId}/credits?api_key=${API_KEY}&language=en-US`).then(
    (response) => response.json()
  );
};


export interface IGetSearchResult {
  page: number;
  results: ISearch[]; 
  total_pages: number;
  total_results: number;
};
interface ISearch {
  id: number;
  overview: string;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: string;
};

export function getSearchResult(keyword: string) {
  return fetch(`${BASE_URL}/search/multi/?api_key=${API_KEY}&language=en-US&query=${keyword}`).then(
    (response) => response.json())
};
