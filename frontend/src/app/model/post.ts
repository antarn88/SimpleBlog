import { User } from './user';

export class Post {
  _id = '';
  title = '';
  body = '';
  author = new User();
  visibility = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
