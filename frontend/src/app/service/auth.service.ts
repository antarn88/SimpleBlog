import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { User } from '../model/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = `${this.config.apiUrl}/login`;
  logoutUrl = `${this.config.apiUrl}/logout`;
  currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  lastToken = '';
  storageName = 'currentUser';

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) { }

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  async login(loginData: User): Promise<Observable<{ _id: string, user: User, accessToken: string; }>> {
    let user: User = new User();
    let response: { _id: string, user: User, accessToken: string; } = { _id: '', user: new User(), accessToken: '' };

    response = await this.http.post<{ _id: string, user: User, accessToken: string; }>(
      this.loginUrl,
      { email: loginData.email, password: loginData.password },
    ).toPromise();

    if (response.user._id && response.accessToken) {
      // this.lastSessionId = response._id;
      this.lastToken = response.accessToken;
      user = await this.userService.get(response.user.username).toPromise();

      if (user) {
        // admin.sessionId = this.lastSessionId;
        user.token = this.lastToken;
        localStorage.setItem(this.storageName, JSON.stringify(user));
        this.currentUserSubject.next(user);
      } else {
        localStorage.removeItem(this.storageName);
        this.currentUserSubject.next(new User());
      }

      return of(response);
    }
    return of({ _id: '', user: new User(), accessToken: '' });
  }

  async logout(ignoreHttp = false): Promise<void> {
    // if (!ignoreHttp) {
    //   // Delete session from database
    //   const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    //   await this.http.post<{}>(this.logoutUrl, { sessionId: currentUser.sessionId, token: currentUser.token }).toPromise();
    // }

    this.lastToken = '';
    localStorage.removeItem(this.storageName);
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }
}
