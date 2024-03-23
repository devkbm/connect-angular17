import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Article } from './article.model';
import { ArticleService } from './article.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { NzListModule } from 'ng-zorro-antd/list';


@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule, NzListModule
  ],
  template: `
    <nz-list>
      @for (article of articles; track article.articleId) {
        <nz-list-item>
          <nz-list-item-meta
            nzAvatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            [nzDescription]="article.title">
            <nz-list-item-meta-title>
              <a>{{ article.contents }}</a>
              <button (click)="onClick(article)">edit </button>
            </nz-list-item-meta-title>
          </nz-list-item-meta>
        </nz-list-item>
      }
    </nz-list>
  `,
  styles: `
  `
})
export class ArticleListComponent {

  private service = inject(ArticleService);
  articles: Article[] = [];

  boardId = input<string>();

  articleEditClicked = output<Article>();

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

  onClick(article: any) {
    console.log(article);
    this.articleEditClicked.emit(article);
  }
}
