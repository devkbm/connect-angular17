import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';

import { MenuGroupGridComponent } from './menu-group-grid.component';
import { MenuGridComponent } from './menu-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { NzTreeSelectCustomComponent } from 'src/app/shared-component/nz-tree-select-custom/nz-tree-select-custom.component';
import { MenuFormComponent } from './menu-form.component';
import { MenuGroupFormComponent } from './menu-group-form.component';
import { MenuRoleTreeComponent } from './menu-role-tree.component';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDrawerModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    NzTreeSelectCustomComponent,
    MenuGroupGridComponent,
    MenuGroupFormComponent,
    MenuFormComponent,
    MenuGridComponent,
    MenuRoleTreeComponent
  ],
  template: `
<app-nz-page-header-custom title="메뉴 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<app-nz-search-area>
  <div nz-col [nzSpan]="8">
    <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
      <input type="text" [(ngModel)]="queryMenuGroup.value" nz-input placeholder="input search text" (keyup.enter)="getMenuGroupList()">
    </nz-input-group>
    <ng-template #addOnBeforeTemplate>
      <nz-select [(ngModel)]="queryMenuGroup.key">
        @for (option of queryMenuGroup.list; track option.value) {
        <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
        }
      </nz-select>
    </ng-template>
    <ng-template #suffixIconSearch>
      <span nz-icon nzType="search"></span>
    </ng-template>
  </div>

  <div nz-col [nzSpan]="8">
    <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate2" [nzSuffix]="suffixIconSearch2">
      <input type="text" [(ngModel)]="queryMenu.value" nz-input placeholder="input search text" (keyup.enter)="getMenuList()">
    </nz-input-group>
    <ng-template #addOnBeforeTemplate2>
      <nz-select [(ngModel)]="queryMenu.key">
        @for (option of queryMenu.list; track option.value) {
        <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
        }
      </nz-select>
    </ng-template>
    <ng-template #suffixIconSearch2>
      <span nz-icon nzType="search"></span>
    </ng-template>
  </div>

  <div nz-col [nzSpan]="8" style="text-align: right;">
    <button nz-button (click)="newMenuGroup()">
      <span nz-icon nzType="search"></span>메뉴그룹등록
    </button>
    <nz-divider nzType="vertical"></nz-divider>

    <button nz-button (click)="newMenu()">
      <span nz-icon nzType="form"></span>메뉴등록
    </button>
    <nz-divider nzType="vertical"></nz-divider>

    <button nz-button (click)="getMenuGroupList()">
      <span nz-icon nzType="form"></span>조회
    </button>

  </div>
</app-nz-search-area>

<div class="content">
  <h3 class="pgm-title">메뉴 그룹 목록</h3>
  <app-menu-group-grid
    #menuGroupGrid
    id="menuGroupGrid"
    (rowSelected)="menuGroupGridRowClicked($event)"
    (editButtonClicked)="editMenuGroup($event)"
    (rowDoubleClicked)="editMenuGroup($event)">
  </app-menu-group-grid>

  <h3 class="pgm-title">메뉴 목록</h3>
  <app-menu-grid
    id="menuGrid"
    #menuGrid
    (rowSelected)="menuGridRowClicked($event)"
    (editButtonClicked)="editMenu($event)"
    (rowDoubleClicked)="editMenu($event)">
  </app-menu-grid>
</div>

<app-menu-role-tree>

</app-menu-role-tree>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerMenuGroup.visible"
  nzTitle="메뉴그룹 등록"
  (nzOnClose)="drawerMenuGroup.visible = false">
    <app-menu-group-form #menuGroupForm *nzDrawerContent
      [initLoadId]="drawerMenuGroup.initLoadId"
      (formSaved)="getMenuGroupList()"
      (formDeleted)="getMenuGroupList()"
      (formClosed)="drawerMenuGroup.visible = false">
    </app-menu-group-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerMenu.visible"
  nzTitle="메뉴 등록"
  (nzOnClose)="drawerMenu.visible = false">
    <app-menu-form #menuForm *nzDrawerContent
      [menuGroupId]="drawerMenuGroup.initLoadId"
      [initLoadId]="drawerMenu.initLoadId"
      (formSaved)="getMenuList()"
      (formDeleted)="getMenuList()"
      (formClosed)="drawerMenu.visible = false">
    </app-menu-form>
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
  margin-bottom: 5PX;
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
export class MenuComponent extends AppBase implements OnInit {

  @ViewChild(MenuGroupGridComponent) gridMenuGroup!: MenuGroupGridComponent;
  @ViewChild(MenuGridComponent) gridMenu!: MenuGridComponent;

  queryMenuGroup: { key: string, value: string, list: {label: string, value: string}[] } = {
    key: 'menuGroupId',
    value: '',
    list: [
      {label: '메뉴그룹ID', value: 'menuGroupCode'},
      {label: '메뉴그룹명', value: 'menuGroupName'}
    ]
  }

  queryMenu: { key: string, value: string, list: {label: string, value: string}[] } = {
    key: 'menuId',
    value: '',
    list: [
      {label: '메뉴ID', value: 'menuCode'},
      {label: '메뉴명', value: 'menuName'}
    ]
  }

  drawerMenuGroup: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerMenu: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  ngOnInit() {
  }

  //#region 메뉴그룹
  getMenuGroupList(): void {
    let params: any = new Object();
    if ( this.queryMenuGroup.value !== '') {
      params[this.queryMenuGroup.key] = this.queryMenuGroup.value;
    }

    this.drawerMenuGroup.visible = false;
    this.gridMenu.clearData();
    this.gridMenuGroup.getMenuGroupList(params);
  }

  newMenuGroup(): void {
    this.drawerMenuGroup.initLoadId = null;
    this.drawerMenuGroup.visible = true;
  }

  editMenuGroup(item: any) {
    this.drawerMenuGroup.initLoadId = item.menuGroupCode;
    this.drawerMenuGroup.visible = true;
  }

  menuGroupGridRowClicked(row: any): void {
    this.drawerMenuGroup.initLoadId = row.menuGroupCode;
    this.getMenuList();
  }
  //#endregion 메뉴그룹

  //#region 메뉴
  getMenuList(): void {
    let params: any = new Object();
    params['menuGroupCode'] = this.drawerMenuGroup.initLoadId;

    if ( this.queryMenu.value !== '') {
      params[this.queryMenu.key] = this.queryMenu.value;
    }

    this.drawerMenu.visible = false;
    this.gridMenu.getMenuList(params);
  }

  newMenu(): void {
    this.drawerMenu.initLoadId = null;
    this.drawerMenu.visible = true;
  }

  editMenu(item: any) {
    this.drawerMenu.initLoadId = {menuGroupCode: item.menuGroupCode, menuCode: item.menuCode};
    this.drawerMenu.visible = true;
  }

  menuGridRowClicked(row: any): void {
    this.drawerMenu.initLoadId =  {menuGroupCode: row.menuGroupCode, menuCode: row.menuCode};
  }
  //#endregion 메뉴

}
