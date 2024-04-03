import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Article } from './article.model';
import { ArticleService } from './article.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { NzListModule } from 'ng-zorro-antd/list';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ArticleShareService } from './article-share.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ArticleListRowComponent } from './article-list-row.component';

// 무한 스크롤 적용 필요
// https://www.npmjs.com/package/ngx-infinite-scroll

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule, NzListModule, NzButtonModule, InfiniteScrollModule, ArticleListRowComponent
  ],
  template: `
    <div
      class="search-results"
      infiniteScroll
      [infiniteScrollDistance]="1"
      [infiniteScrollUpDistance]="1"
      [infiniteScrollThrottle]="350"
      [alwaysCallback]="true"
      [scrollWindow]="false"
      (scrolled)="onScroll($event)"
      (scrolledUp)="onScrollUp()">
      <nz-list>
        @for (article of articles; track article.articleId; let idx = $index) {
          <nz-list-item>
            <nz-list-item-meta
              nzAvatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              [nzDescription]="article.title">
              <nz-list-item-meta-title>
                <!--{{idx+1}} -->
                <a (click)="onViewClicked(article)"><div [innerHTML]="article.contents"></div></a>
                <button nz-button (click)="onEditClicked(article)"><span nz-icon nzType="search" nzTheme="outline"></span>edit</button>
                <!--<button nz-button (click)="onViewClicked(article)"><span nz-icon nzType="search" nzTheme="outline"></span>view</button>-->

              </nz-list-item-meta-title>
            </nz-list-item-meta>
          </nz-list-item>

          <!--<app-article-list-row [article]="article"></app-article-list-row>-->
        }
      </nz-list>
    </div>
  `,
  styles: `
    .search-results {
      height: 600px;
      overflow: scroll;
    }
  `
})
export class ArticleListComponent {

  private service = inject(ArticleService);
  articles: Article[] = [];

  boardId = input<string>();

  articleEditClicked = output<Article>();
  articleViewClicked = output<Article>();

  articleShareService = inject(ArticleShareService);

  constructor() {
    effect(() => {
      this.getArticleList(this.boardId());
    })

  }

  getArticleList(fkBoard: any): void {
    this.service
        .getArticleList(fkBoard)
        .subscribe(
          (model: ResponseList<Article>) => {
            if (model.total > 0) {
              this.articles = model.data;
              // this.sizeToFit();
            } else {
              this.articles = [];
            }
            //this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  onEditClicked(article: any) {
    this.articleEditClicked.emit(article);
  }

  onViewClicked(article: any) {
    this.articleShareService.change(article);

    this.articleViewClicked.emit(article);
  }

  onScroll(ev: any) {
    //console.log("scrolled!" + ev);
    console.log(ev);
  }

  onScrollUp() {
    console.log("scrolled Up!");
  }
}
