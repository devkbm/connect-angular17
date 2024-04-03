import { Component, input, output } from '@angular/core';
import { Article } from './article.model';

@Component({
  selector: 'app-article-list-row',
  standalone: true,
  template: `
    {{article()?.title}} -
    <a (click)="onViewClicked(article)"><div [innerHTML]="article()?.contents"></div></a>
  `,
  styles: `
  `
})
export class ArticleListRowComponent {

  article = input<Article>();

  articleViewClicked = output<Article>();

  onViewClicked(article: any) {
    this.articleViewClicked.emit(article);
  }

}
