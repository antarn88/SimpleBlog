import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localesHu from '@angular/common/locales/hu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend';

  ngOnInit(): void {
    registerLocaleData(localesHu, 'hu-HU');
  }
}
