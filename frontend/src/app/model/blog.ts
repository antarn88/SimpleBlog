import { Post } from './post';
import { User } from './user';

export class Blog {
  _id = '';
  owner = new User();
  posts: Post[] = [];
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
