import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';

import { BizCodeTypeGridComponent } from './biz-code-type-grid.component';
import { BizCodeGridComponent } from './biz-code-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { BizCodeFormComponent } from './biz-code-form.component';
import { BizCodeTypeFormComponent } from './biz-code-type-form.component';

@Component({
  selector: 'app-biz-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,

    BizCodeTypeGridComponent,
    BizCodeGridComponent,
    BizCodeTypeFormComponent,
    BizCodeFormComponent
  ],
  template: `
<app-nz-page-header-custom title="업무코드 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<div nz-row class="btn-group">
  <div nz-col [nzSpan]="24" style="text-align: right;">
    <button nz-button (click)="selectBizCodeTypeList()">
      <span nz-icon nzType="search" nzTheme="outline"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="newCodeType()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규 분류
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="newCode()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규 코드
    </button>
  </div>
</div>

<div class="content">
  <h3 class="pgm-title">업무코드분류</h3>
  <app-biz-type-grid
    (rowClickedEvent)="codeTypeGridRowClicked($event)"
    (editButtonClickedEvent)="editCodeType($event)"
    (rowDoubleClickedEvent)="editCodeType($event)">
  </app-biz-type-grid>

  <h3 class="pgm-title">업무코드</h3>
  <app-biz-code-grid
    (rowClickedEvent)="codeGridRowClicked($event)"
    (editButtonClickedEvent)="editCode($event)"
    (rowDoubleClickedEvent)="editCode($event)">
  </app-biz-code-grid>
</div>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    nzWidth="80%"
    [nzVisible]="drawerCodeType.visible"
    nzTitle="업무코드분류 등록"
    (nzOnClose)="drawerCodeType.visible = false">
    <app-biz-code-type-form *nzDrawerContent
        [initLoadId]="drawerCodeType.initLoadId"
        (formSaved)="selectBizCodeTypeList()"
        (formDeleted)="selectBizCodeTypeList()"
        (formClosed)="drawerCodeType.visible = false">
    </app-biz-code-type-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    nzWidth="80%"
    [nzVisible]="drawerCode.visible"
    nzTitle="업무코드 등록"
    (nzOnClose)="drawerCode.visible = false">
    <app-biz-code-form *nzDrawerContent
        [initLoadId]="drawerCode.initLoadId"
        (formSaved)="selectBizCodeList()"
        (formDeleted)="selectBizCodeList()"
        (formClosed)="drawerCode.visible = false">
    </app-biz-code-form>
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

.content {
  height: calc(100% - 144px);
  display: grid;
  grid-template-rows: 34px 1fr 34px 1fr;
  grid-template-columns: 1fr;
}

.footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 10px 16px;
  text-align: right;
  left: 0px;
  /*background: #fff;*/
}
  `
})
export class BizCodeComponent extends AppBase implements OnInit {

  @ViewChild(BizCodeTypeGridComponent) gridCodeType!: BizCodeTypeGridComponent;
  @ViewChild(BizCodeGridComponent) gridCode!: BizCodeGridComponent;

  drawerCodeType: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerCode: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  ngOnInit(): void {
  }

  selectBizCodeTypeList() {
    this.drawerCodeType.visible = false;

    this.gridCodeType.getList();
  }

  newCodeType() {
    this.drawerCodeType.initLoadId = null;
    this.drawerCodeType.visible = true;
  }

  editCodeType(params: any) {
    this.drawerCodeType.initLoadId = params.typeId;
    this.drawerCodeType.visible = true;
  }

  codeTypeGridRowClicked(params: any) {
    this.drawerCodeType.initLoadId = params.typeId;
    this.drawerCode.initLoadId = {typeId: params.typeId};

    this.gridCode.getList(this.drawerCode.initLoadId.typeId);
  }

  selectBizCodeList() {
    this.drawerCode.visible = false;
    this.gridCode.getList(this.drawerCode.initLoadId.typeId);
  }

  newCode() {
    this.drawerCode.visible = true;
  }

  editCode(params: any) {
    this.drawerCode.initLoadId = {typeId: params.typeId, code: params.code};
    this.drawerCode.visible = true;
  }

  codeGridRowClicked(params: any) {
    this.drawerCode.initLoadId = {typeId: params.typeId, code: params.code};
  }

}
