import { AfterContentInit, AfterViewInit, Component, ContentChild, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';

import { TermGridComponent } from './term-grid.component';
import { DataDomainGridComponent } from './data-domain-grid.component';
import { WordGridComponent } from './word-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { DataDomainFormComponent } from './data-domain-form.component';
import { TermFormComponent } from './term-form.component';
import { WordFormComponent } from './word-form.component';

@Component({
  selector: 'app-term',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzDrawerModule,
    NzTabsModule,
    NzGridModule,
    NzDividerModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,

    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    DataDomainFormComponent,
    DataDomainGridComponent,
    TermFormComponent,
    TermGridComponent,
    WordFormComponent,
    WordGridComponent
  ],
  template: `
<app-nz-page-header-custom title="용어사전 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<app-nz-search-area>
  <div nz-col [nzSpan]="12">
    <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
      <input type="text" [(ngModel)]="query.value" nz-input placeholder="input search text" (keyup.enter)="getTermList()">
    </nz-input-group>
    <ng-template #addOnBeforeTemplate>
      <nz-select [(ngModel)]="query.key">
        @for (option of query.list; track option.value) {
        <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
        }
      </nz-select>
    </ng-template>
    <ng-template #suffixIconSearch>
      <span nz-icon nzType="search"></span>
    </ng-template>
  </div>
  <div nz-col [nzSpan]="12" style="text-align: right;">
    <button nz-button (click)="getTermList()">
      <span nz-icon nzType="search"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="newTerm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규 용어
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="newWord()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규 단어
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="newDomain()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규 도메인
    </button>
  </div>
</app-nz-search-area>

<nz-tabset [nzSelectedIndex]="tabIndex">
  <nz-tab nzTitle="용어사전">
    <!--<h3>용어사전 목록</h3>-->
    <div class="grid-wrapper">
      <app-term-grid #termGrid
        (rowClickedEvent)="termGridSelected($event)"
        (editButtonClickedEvent)="editTerm($event)"
        (rowDoubleClickedEvent)="editTerm($event)">
      </app-term-grid>
    </div>
  </nz-tab>

  <nz-tab nzTitle="단어사전">
    <div class="grid-wrapper">
      <app-word-grid #wordGrid
      (rowClickedEvent)="wordGridSelected($event)"
      (editButtonClickedEvent)="editWord($event)"
      (rowDoubleClickedEvent)="editWord($event)">
      </app-word-grid>
    </div>
  </nz-tab>

  <nz-tab nzTitle="도메인">
    <div class="grid-wrapper">
      <app-data-domain-grid #domainGrid
        (rowClickedEvent)="domainGridSelected($event)"
        (editButtonClickedEvent)="this.domainDrawer.visible = true"
        (rowDoubleClickedEvent)="this.domainDrawer.visible = true">
      </app-data-domain-grid>
    </div>
  </nz-tab>
</nz-tabset>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="termDrawer.visible"
  nzTitle="용어 등록"
  (nzOnClose)="this.termDrawer.visible = false">
    <app-term-form *nzDrawerContent
      #termForm
      [initLoadId]="termDrawer.initLoadId"
      (formSaved)="getTermList()"
      (formDeleted)="getTermList()"
      (formClosed)="this.termDrawer.visible = false">
    </app-term-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="wordDrawer.visible"
  nzTitle="단어 등록"
  (nzOnClose)="this.wordDrawer.visible = false">
    <app-word-form *nzDrawerContent #wordForm
      [initLoadId]="wordDrawer.initLoadId"
      (formSaved)="getWordList()"
      (formDeleted)="getWordList()"
      (formClosed)="wordDrawer.visible = false">
    </app-word-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="domainDrawer.visible"
  nzTitle="도메인 등록"
  (nzOnClose)="domainDrawer.visible = false">
    <app-data-domain-form *nzDrawerContent #doaminForm
      [initLoadId]="domainDrawer.initLoadId"
      (formSaved)="getDomainList()"
      (formDeleted)="getDomainList()"
      (formClosed)="domainDrawer.visible = false">
    </app-data-domain-form>
</nz-drawer>

  `,
  styles: `
.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.grid-wrapper {
  height: calc(100vh - 300px);
  margin: 0;
  padding: 0;
}
  `
})
export class TermComponent extends AppBase implements OnInit {

  @ViewChild('termGrid') termGrid!: TermGridComponent;
  @ViewChild('wordGrid') wordGrid!: WordGridComponent;
  @ViewChild('domainGrid') domainGrid!: DataDomainGridComponent;

  query: { key: string, value: string, list: {label: string, value: string}[] } = {
    key: 'term',
    value: '',
    list: [
      {label: '용어', value: 'term'},
      {label: '업무영역', value: 'domain'}
    ]
  }

  tabIndex: number = 0;

  termDrawer: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  wordDrawer: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  domainDrawer: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  ngOnInit(): void {
  }

  getList() {
    if (this.tabIndex === 0) {
      this.getTermList();
    } else if (this.tabIndex === 1) {
      this.getWordList();
    } else if (this.tabIndex === 2) {
      this.getDomainList();
    }
  }

  //#region 용어사전
  getTermList() {
    let params: any = new Object();
    if ( this.query.value !== '') {
      params[this.query.key] = this.query.value;
    }

    this.termDrawer.visible = false;
    this.termGrid.getList(params);
  }

  newTerm() {
    this.termDrawer.initLoadId = null;
    this.termDrawer.visible = true;
  }

  editTerm(item: any) {
    this.termDrawer.initLoadId = item.termId;
    this.termDrawer.visible = true;
  }

  termGridSelected(item: any) {
    this.termDrawer.initLoadId = item.termId;
  }
  //#endregion 용어사전

  //#region 단어사전
  getWordList() {
    this.wordDrawer.visible = false;
    this.wordGrid.getList();
  }

  newWord() {
    this.wordDrawer.initLoadId = null;
    this.wordDrawer.visible = true;
  }

  editWord(item: any) {
    this.wordDrawer.initLoadId = item.logicalName;
    this.wordDrawer.visible = true;
  }

  wordGridSelected(item: any) {
    this.wordDrawer.initLoadId = item.logicalName;
  }
  //#endregion 단어사전

  //#region 도메인
  getDomainList() {
    this.domainDrawer.visible = false;
    this.domainGrid.getList();
  }

  newDomain() {
    this.domainDrawer.initLoadId = null;
    this.domainDrawer.visible = true;
  }

  domainGridSelected(item: any) {
    this.domainDrawer.initLoadId = item.domainId;
  }
  //#endregion 도메인

}
