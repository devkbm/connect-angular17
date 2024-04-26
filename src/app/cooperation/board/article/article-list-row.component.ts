import { Component, Signal, computed, input, output, signal } from '@angular/core';
import { ArticleList } from './article-list.model';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { GlobalProperty } from 'src/app/core/global-property';

@Component({
    selector: 'app-article-list-row',
    standalone: true,
    template: `
    <div>
      <nz-avatar class="avatar" nzShape="square" [nzSize]='24' [nzSrc]="imageSrc()"/>
      {{article()?.articleId}} - {{article()?.writerName}} - {{article()?.hitCount}} <br>
      <a (click)="onViewClicked(article)">{{article()?.title}}</a>
      <button (click)="onEditClicked(article)">수정</button>
    </div>
    `,
    styles: `
    :host {
      display: inline
    }
    `,
    imports: [ NzAvatarModule ]
})
export class ArticleListRowComponent {

  article = input<ArticleList>();

  imageSrc: Signal<string> = computed(() => GlobalProperty.serverUrl + '/api/system/fileimage/' + this.article()?.writerImage );

  viewClicked = output<ArticleList>();
  editClicked = output<ArticleList>();

  onViewClicked(article: any) {
    this.viewClicked.emit(article);
  }

  onEditClicked(article: any) {
    this.editClicked.emit(article);
  }

}
