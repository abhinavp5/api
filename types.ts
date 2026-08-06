export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SpotifyRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyTopTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTopTrack[];
}

export interface TopSongRow {
  id: string;
  ranking: number;
  title: string;
  coverart: string | null;
  album: string;
}

export interface ArtistRow {
  id: string;
  name: string;
}

export interface CourseRow {
  course_dept: string;
  course_num: number;
}
