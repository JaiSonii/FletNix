export interface Show {
  show_id: string;
  title: string;
  type: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  cast: string;
  director: string;
  listed_in: string;
  imdb_rating : string
}
export interface ReviewData {
    source: string;
    value: string;
}
export interface ShowDetail extends Show {
    reviews?: [ReviewData];
    recommendations? : Show[]
}