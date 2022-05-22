import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User = new User();
  serverError = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  async onLogin(form: NgForm): Promise<void> {
    try {
      await this.auth.login(form.value);
      if (this.auth.currentUserValue) {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.serverError = error.error;
      const to = setTimeout(() => {
        clearTimeout(to);
        this.serverError = '';
      }, 3000);
    }
  }
}
