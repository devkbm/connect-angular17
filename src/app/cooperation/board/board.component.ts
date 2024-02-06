import { AfterViewInit, Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { ArticleGridComponent } from './component/article-grid.component';
import { BoardTreeComponent } from './component/board-tree.component';
import { Article } from './component/article.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { BoardFormComponent } from './board-management/board-form.component';
import { BoardManagementComponent } from './board-management/board-management.component';
import { ArticleFormComponent } from './component/article-form.component';
import { ArticleViewComponent } from './component/article-view.component';

export interface TabArticle {
  tabName: string;
  articleId: number;
  article: Article;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzButtonModule,
    NzDrawerModule,
    NzTabsModule,
    NzInputModule,
    NzGridModule,
    NzTreeModule,
    NzDividerModule,
    NzIconModule,

    ArticleGridComponent,
    BoardTreeComponent,
    ArticleViewComponent,
    ArticleFormComponent,
    BoardFormComponent,
    BoardManagementComponent
  ],
  template: `
<div nz-row>
  <div nz-col [nzXs]="12" [nzSm]="12">

  </div>
  <div nz-col style="text-align: right" [nzXs]="12" [nzSm]="12">
    <button nz-button (click)="getBoardTree()">
      <span nz-icon nzType="search" nzTheme="outline"></span>조회
    </button>
    <button nz-button (click)="newArticle()">
      <span nz-icon nzType="form" nzTheme="outline"></span>게시글 등록
    </button>
  </div>
</div>

<div class="tree">
  <h3 class="pgm-title">게시판 목록</h3>
  <nz-input-group nzSearch [nzSuffix]="suffixIconSearch">
    <input type="text" [(ngModel)]="queryValue" nz-input placeholder="input search text">
  </nz-input-group>
  <ng-template #suffixIconSearch>
    <span nz-icon nzType="search"></span>
  </ng-template>
  <app-board-tree id="boardTree" #boardTree
    [searchValue]="queryValue"
    (itemSelected)="setBoardSelect($event)">
  </app-board-tree>
</div>


<nz-tabset [(nzSelectedIndex)]="tabIndex" nzType="editable-card" nzHideAdd (nzClose)="closeTab($event)">
  <nz-tab [nzTitle]="tabTitle">
    <div id="grid-wrapper" class="grid">
      <app-article-grid id="articleGrid" #articleGrid
        (rowClicked)="selectArticle($event)"
        (rowDoubleClicked)="addTabArticleView()"
        (editButtonClicked)="editArticleByButton($event)">
      </app-article-grid>
    </div>
  </nz-tab>
  @for (tab of tabs; track tab.articleId) {
  <nz-tab [nzClosable]="$index >= 0" [nzTitle]="tab.tabName">
    <app-article-view [article]="tab.article">
    </app-article-view>
  </nz-tab>
  }
</nz-tabset>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="'80%'"
    [nzVisible]="drawerArticle.visible"
    nzTitle="게시글 등록"
    (nzOnClose)="drawerArticle.visible = false">
    <app-article-form #articleForm *nzDrawerContent
      [boardId]="drawerBoard.initLoadId"
      [initLoadId]="this.drawerArticle.initLoadId"
      (formSaved)="getArticleGridData()"
      (formDeleted)="getArticleGridData()"
      (formClosed)="drawerArticle.visible = false">
    </app-article-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="800"
    [nzVisible]="drawerArticleView.visible"
    nzTitle="게시글 조회"
    (nzOnClose)="drawerArticleView.visible = false">
    <app-article-view [article]="drawerArticleView.article" *nzDrawerContent>
    </app-article-view>
</nz-drawer>


  `,
  styles: `
.content {
  height: calc(100vh - 140px);
  display: grid;
  grid-template-rows: 24px 1fr;
  grid-template-columns: 200px 1fr;
}

.grid {
  height: calc(100vh - 200px);
}

.tree {
  width: 200px;
  height: calc(100vh - 140px);
  float: left;
  /*background-color:burlywood*/
}

:host ::ng-deep .ck-editor__editable {
  min-height: 700px !important;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.ime {
  -webkit-ime-mode:active;
  -moz-ime-mode:active;
  -ms-ime-mode:active;
  ime-mode:active;
}

  `
})
export class BoardComponent implements AfterViewInit {

  @ViewChild(BoardTreeComponent) boardTree!: BoardTreeComponent;
  @ViewChild(ArticleGridComponent) articleGrid!: ArticleGridComponent;

  drawerBoard: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerArticle: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerArticleView: { visible: boolean, article: any} = {
    visible: false,
    article: null
  }

  tabIndex: number = 0;
  tabs: TabArticle[] = [];
  tabTitle: any;

  /**
   * 게시판 트리 조회 Filter 조건
   */
  queryValue: any;

  private message = inject(NzMessageService);
  public viewContainerRef = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    this.getBoardTree();
  }

  setBoardSelect(item: any): void {
    this.tabTitle = item.title;
    this.drawerBoard.initLoadId = item.key;

    this.getArticleGridData();
  }

  getArticleGridData(): void {
    this.drawerArticle.visible = false;
    this.drawerArticleView.visible = false;

    this.articleGrid.getArticleList(this.drawerBoard.initLoadId);
  }

  getBoardTree(): void {
    this.drawerBoard.visible = false;
    this.boardTree.getboardHierarchy();
  }

  newArticle(): void {
    if (this.drawerBoard.initLoadId === null || this.drawerBoard.initLoadId === undefined)  {
      this.message.create('error', '게시판을 선택해주세요.');
      return;
    }

    /*
    const componentRef = this.viewContainerRef.createComponent(ArticleFormComponent);
    this.tabs.push(componentRef);
    */

    this.drawerArticle.initLoadId = null;
    this.drawerArticle.visible = true;
  }

  selectArticle(item: any) {
    this.drawerArticleView.article = item;
    this.drawerArticle.initLoadId = item.articleId;
  }

  editArticleByButton(item: any) {
    this.drawerArticle.initLoadId = item.articleId;
    if (this.drawerArticle.initLoadId === null || this.drawerArticle.initLoadId === undefined) {
      this.message.create('error', '게시글을 선택해주세요.');
      return;
    }

    this.drawerArticle.visible = true;
  }

  addTabArticleView(): void {
    let title: string | null = '';
    const title_lentgh = this.drawerArticleView.article?.title.length as number;
    if (title_lentgh > 8) {
      title = this.drawerArticleView.article?.title.substring(0, 8) + '...';
    } else {
      title = this.drawerArticleView.article?.title as string;
    }

    const articleId = this.drawerArticleView.article?.articleId as number;
    const article = this.drawerArticleView.article as Article;
    const newTab: TabArticle = {
      tabName: title,
      articleId: articleId,
      article: article
    }

    let tabIndex = null;
    for (const index in this.tabs) {
      if (this.tabs[index].articleId === this.drawerArticleView.article?.articleId) {
        tabIndex = index;
      }
    }

    if (tabIndex === null) {
      this.tabs.push(newTab);
      this.tabIndex = this.tabs.length;
    } else {
      this.tabIndex = parseInt(tabIndex,10) + 1;
    }

  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index-1, 1);
  }

  print(item: any): void {
    console.log(item);
  }

}
