import { Injectable, signal } from '@angular/core';
import { Article } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleShareService {

  article = signal<Article | null>(null);

  change(entity: Article) {

    this.article.set(entity);
    console.log(this.article());
  }

  getData() {
    return this.article();
  }

}
