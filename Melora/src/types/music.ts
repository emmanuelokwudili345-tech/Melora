interface Artwork {
  _150x150?: string;
  _480x480?: string;
  _1000x1000?: string;
}

export interface MusicUser {
  id: string;
  name: string;
  handle: string;
  profilePicture?: Artwork;
}

export interface MusicTrack {
  id: string;
  title: string;
  duration: number;
  genre?: string;

  artwork?: Artwork;

  user: MusicUser;

  playCount?: number;
  favoriteCount?: number;

  isStreamable: boolean;

  stream?: {
    url?: string;
  };

  access?: {
    stream: boolean;
    download: boolean;
  };
}