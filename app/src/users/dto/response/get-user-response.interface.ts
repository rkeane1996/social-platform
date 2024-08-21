export interface GetUsersResponse {
  id: string;
  username: string;
  name: string;
  bio: string;
  profile_picture: string;
  followers: string[];
  following: string[];
  posts: string[];
}
