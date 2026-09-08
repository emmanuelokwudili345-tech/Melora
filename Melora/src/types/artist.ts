export interface Artist {
  id: string;
  name: string;
  handle: string;
  profilePicture?: {
    _150x150?: string;
    _480x480?: string;
    _1000x1000?: string;
  };
}