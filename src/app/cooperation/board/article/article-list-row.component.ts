import { Component, Signal, computed, input, output, signal } from '@angular/core';
import { ArticleList } from './article-list.model';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { GlobalProperty } from 'src/app/core/global-property';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
    selector: 'app-article-list-row',
    standalone: true,
    template: `
    <div>
      <nz-avatar class="avatar" nzShape="square" [nzSize]='24' [nzSrc]="imageSrc()"/>
      {{article()?.writerName}} ·
      <span nz-icon nzType="eye" nzTheme="outline"></span> {{article()?.hitCount}}
      @if (article()?.fileCount ?? false) {
        · <span nz-icon nzType="file" nzTheme="outline"></span> {{article()?.fileCount}}
      }
      <br/>
      <!--
      {{article()?.isRead}} -
      {{article()?.articleId}} -
      -->
      <a [class.text-bold]="!article()?.isRead" (click)="onViewClicked(article)">{{article()?.title}}</a>
      &nbsp;
      @if (article()?.editable) {
        <button nz-button nzShape="circle" (click)="onEditClicked(article)"><span nz-icon nzType="edit" nzTheme="outline"></span></button>
      }
    </div>
    `,
    styles: `
    :host {
      display: inline
    }

    .text-bold {
      font-weight: bold;
    }

    a {
      color: Silver;
    }

    a:hover {
      color: LightSlateGray;
      text-decoration: underline;
    }
    `,
    imports: [ NzAvatarModule, NzButtonModule, NzIconModule ]
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
