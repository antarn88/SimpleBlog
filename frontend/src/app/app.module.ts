import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { HomeComponent } from './page/home/home.component';
import { ProfileComponent } from './page/profile/profile.component';
import { AdminComponent } from './page/admin/admin.component';
import { FooterComponent } from './widget/footer/footer.component';
import { NavComponent } from './widget/nav/nav.component';
import { NotfoundComponent } from './page/notfound/notfound.component';
import { PostCardComponent } from './widget/post-card/post-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    AdminComponent,
    FooterComponent,
    NavComponent,
    NotfoundComponent,
    PostCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
