import { Component, input, output } from '@angular/core';
import { Article } from './article.model';
import { ArticleList } from './article-list.model';

@Component({
    selector: 'app-article-list-row',
    standalone: true,
    template: `
    <div>
      {{article()?.articleId}}
      <a (click)="onViewClicked(article)">{{article()?.title}}</a>
      <button (click)="onEditClicked(article)">수정</button>
    </div>
  `,
    styles: `
    :host {
      display: inline
    }
  `
})
export class ArticleListRowComponent {

  article = input<ArticleList>();

  viewClicked = output<ArticleList>();
  editClicked = output<ArticleList>();

  onViewClicked(article: any) {
    this.viewClicked.emit(article);
  }

  onEditClicked(article: any) {
    this.editClicked.emit(article);
  }

}
