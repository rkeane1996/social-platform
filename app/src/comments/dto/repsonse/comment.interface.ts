export interface IComment {
  id?: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: Date;
  likes: string[];
}