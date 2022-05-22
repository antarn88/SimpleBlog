import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) { }

  get(username: string): Observable<User> {
    const url = `${this.config.apiUrl}/users/${username}`;
    return this.http.get<User>(url);
  }
}
