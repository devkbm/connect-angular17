import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';
import { ResponseObject } from 'src/app/core/model/response-object';

import { WebResourceGridComponent } from './web-resource-grid.component';
import { WebResourceService } from './web-resource.service';
import { WebResource } from './web-resource.model';

import { ButtonTemplate, NzButtonsComponent } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { WebResourceFormComponent } from './web-resource-form.component';

@Component({
  selector: 'app-web-resource',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDrawerModule,
    NzButtonsComponent,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    WebResourceGridComponent,
    WebResourceFormComponent
  ],
  template: `
<app-nz-page-header-custom title="리소스 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<app-nz-search-area>
  <div nz-col [nzSpan]="12">
    <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
      <input type="text" [(ngModel)]="query.value" nz-input placeholder="input search text" (keyup.enter)="getList()">
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
    <app-nz-buttons [buttons]="buttons"></app-nz-buttons>
    <!--
    <button nz-button (click)="getList()">
      <span nz-icon nzType="search"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="initForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzDanger="true"
      nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
      (nzOnConfirm)="delete()" (nzOnCancel)="false">
      <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
    </button>
    -->
  </div>
</app-nz-search-area>

<h3 class="grid-title">웹서버 리소스 목록</h3>

<div class="grid-wrapper">
  <app-web-resource-grid #grid
    (rowClicked)="resourceGridRowClicked($event)"
    (editButtonClicked)="editResource($event)"
    (rowDoubleClicked)="editResource($event)">
  </app-web-resource-grid>
</div>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerResource.visible"
  nzTitle="리소스 등록"
  (nzOnClose)="drawerResource.visible = false">
    <app-web-resource-form #form *nzDrawerContent
      [initLoadId]="drawerResource.initLoadId"
      (formSaved)="getList()"
      (formDeleted)="getList()"
      (formClosed)="drawerResource.visible = false">
    </app-web-resource-form>
</nz-drawer>

  `,
  styles: `
.grid-title {
  height: 26px;
  margin-top: 6px;
  margin-left: 6px;
  padding-left: 6px;
  border-left: 6px solid green;
  vertical-align: text-top;
}

/* 페이지 헤더 98px, 조회조건 46px, 그리드 제목 26px, 푸터 24px 제외 */
.grid-wrapper {
  height: calc(100% - 194px)
}
  `
})
export class WebResourceComponent extends AppBase  implements OnInit {

  @ViewChild(WebResourceGridComponent) grid!: WebResourceGridComponent;

  query: { key: string, value: string, list: {label: string, value: string}[] } = {
    key: 'resourceCode',
    value: '',
    list: [
      {label: '리소스코드', value: 'resourceCode'},
      {label: '리소스명', value: 'resourceName'},
      {label: 'URL', value: 'url'},
      {label: '설명', value: 'description'}
    ]
  }

  buttons: ButtonTemplate[] = [{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.newResource();
    }
  },{
    text: '삭제',
    nzType: 'delete',
    isDanger: true,
    popConfirm: {
      title: '삭제하시겠습니까?',
      confirmClick: () => {
        this.delete();
      }
    }
  }];

  drawerResource: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  private service = inject(WebResourceService);

  ngOnInit(): void {
  }

  getList(): void {
    let params: any = new Object();
    if ( this.query.value !== '') {
      params[this.query.key] = this.query.value;
    }

    this.drawerResource.visible = false;
    this.grid.getList(params);
  }

  newResource(): void {
    this.drawerResource.initLoadId = null;
    this.drawerResource.visible = true;
  }

  editResource(item: any): void {
    this.drawerResource.initLoadId = item.resourceId;
    this.drawerResource.visible = true;
  }

  delete(): void {
    const id = this.grid.getSelectedRows()[0].resourceId;

    this.service
        .delete(id)
        .subscribe(
          (model: ResponseObject<WebResource>) => {
            this.getList();
          }
        );
  }

  resourceGridRowClicked(item: any): void {
    this.drawerResource.initLoadId = item.resourceId;
  }

}
