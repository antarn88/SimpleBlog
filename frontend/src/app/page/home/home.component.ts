import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Blog } from 'src/app/model/blog';
import { BlogService } from 'src/app/service/blog.service';
import { ConfigService } from 'src/app/service/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  blog: Blog = new Blog();

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    public configService: ConfigService,
  ) { }

  async ngOnInit(): Promise<void> {
    const { username } = this.activatedRoute.snapshot.params;
    const blog = await this.blogService.get('arnold').toPromise();
    this.blog = blog;
  }
}
