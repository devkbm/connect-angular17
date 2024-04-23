import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleService } from './article.service';
import { NzListModule } from 'ng-zorro-antd/list';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ArticleListRowComponent } from './article-list-row.component';
import { ArticleList } from './article-list.model';
import { ResponseSpringslice } from 'src/app/core/model/response-springslice';

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
      <!--
      <nz-list>
        @for (article of articles; track article.articleId; let idx = $index) {
          <nz-list-item>
            <nz-list-item-meta
              nzAvatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              [nzDescription]="article.title">
              <nz-list-item-meta-title>
                <a (click)="onViewClicked(article)"><div [innerHTML]="article.contents"></div></a>
                <button nz-button (click)="onEditClicked(article)"><span nz-icon nzType="search" nzTheme="outline"></span>edit</button>
              </nz-list-item-meta-title>
            </nz-list-item-meta>
          </nz-list-item>
        }
      </nz-list>
      -->
      @for (article of articles; track article.articleId; let idx = $index) {
        <app-article-list-row
          [article]="article"
          (viewClicked)="onViewClicked(article)"
          (editClicked)="onEditClicked(article)">
        </app-article-list-row>

        <hr class="hr-line">
      }
    </div>
  `,
  styles: `
    .search-results {
      height: 600px;
      overflow: scroll;
    }

    .hr-line {
      border-width:1px 0 0 0; border-color:#818181;
    }
  `
})
export class ArticleListComponent {

  private service = inject(ArticleService);
  articles: ArticleList[] = [];

  boardId = input<string>();

  articleEditClicked = output<ArticleList>();
  articleViewClicked = output<ArticleList>();

  constructor() {
    effect(() => {
      this.getArticleList(this.boardId());
    })

  }

  getArticleList(fkBoard: any): void {
    this.service
        .getArticleSlice(fkBoard)
        .subscribe(
          (model: ResponseSpringslice<ArticleList>) => {
            if (model.numberOfElements > 0) {
              this.articles = model.content;
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
