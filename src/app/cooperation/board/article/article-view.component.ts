import { ArticleShareService } from './article-share.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, inject, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFileUploadComponent } from 'src/app/shared-component/nz-file-upload/nz-file-upload.component';

import { Article } from './article.model';

@Component({
  selector: 'app-article-view',
  standalone: true,
  imports: [
    CommonModule, NzPageHeaderModule, NzFileUploadComponent
  ],
  template: `
    <nz-page-header nzTitle="제목" [nzSubtitle]="article?.title">
      <nz-page-header-content>
          {{article?.fromDate}}
      </nz-page-header-content>
    </nz-page-header>

    <div [innerHTML]="article?.contents">
    </div>

    <app-nz-file-upload
      [fileList]="fileList">
    </app-nz-file-upload>

    {{articleShareService.getData()}}
  `,
  styles: [`
    nz-page-header {
      border: 1px solid rgb(235, 237, 240);
    }
  `]
})
export class ArticleViewComponent implements OnInit {

  @Input() article?: Article;
  fileList: any = [];

  private activatedRoute = inject(ActivatedRoute);
  articleShareService = inject(ArticleShareService);

  ngOnInit() {

    if (this.activatedRoute.snapshot.params['article']) {
      this.article = JSON.parse(this.activatedRoute.snapshot.params['article']);
    }

    this.fileList = this.article?.fileList ?? [];
  }

}
