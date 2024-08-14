export interface IPosts {
  id: string;
  user_id: string;
  caption: string;
  image_url: string;
  created_at: Date;
  likes: string[];
  comments: string[];
}
