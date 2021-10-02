import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from '../model/blog';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(
    private config: ConfigService,
    private http: HttpClient,
  ) { }

  get(username: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.config.apiUrl}/blogs/${username}`);
  }
}
