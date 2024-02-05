import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';
import { ResponseObject } from 'src/app/core/model/response-object';

import { UserGridComponent } from './user-grid.component';
import { UserService } from './user.service';
import { User } from './user.model';

import { ButtonTemplate } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
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
import { UserFormComponent } from './user-form.component';
import { UserImageUploadComponent } from './user-image-upload.component';
import { UserPopupComponent } from './user-popup.component';
import { UserProfileComponent } from './user-profile.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzDrawerModule,
    NzDividerModule,
    NzButtonModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    UserPopupComponent,
    UserGridComponent,
    UserImageUploadComponent,
    UserFormComponent,
    UserProfileComponent
  ],
  template: `
<app-nz-page-header-custom title="사용자 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<app-nz-search-area>
  <div nz-col [nzSpan]="12">
    <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
        <input type="text" [(ngModel)]="query.value" nz-input placeholder="input search text" (keyup.enter)="getUserList()">
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
    <!--<app-nz-buttons [buttons]="buttons"></app-nz-buttons>-->

    <button nz-button (click)="test()">
      <span nz-icon nzType="search"></span>구글 로그인
    </button>
    <button nz-button (click)="getUserList()">
      <span nz-icon nzType="search"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="newForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzDanger="true"
      nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
      (nzOnConfirm)="deleteUser()" (nzOnCancel)="false">
        <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
    </button>
  </div>
</app-nz-search-area>

<h3 class="grid-title">사용자 목록</h3>
<div class="grid-wrapper">
  <app-user-grid #userGrid
    (rowClicked)="userGridSelected($event)"
    (editButtonClicked)="editForm($event)"
    (rowDoubleClicked)="editForm($event)">
  </app-user-grid>
</div>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  [nzWidth]="720"
  [nzVisible]="drawerUser.visible"
  nzTitle="사용자 등록"
  (nzOnClose)="drawerUser.visible = false">
    <app-user-form *nzDrawerContent
      [initLoadId]="drawerUser.initLoadId"
      (formSaved)="getUserList()"
      (formDeleted)="getUserList()"
      (formClosed)="drawerUser.visible = false">
    </app-user-form>
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
  /*height: calc(100% - 194px)*/
  height: calc(100% - 194px)
}

[nz-button] {
  margin: auto;
}

  `
})
export class UserComponent extends AppBase implements OnInit {

  @ViewChild(UserGridComponent) grid!: UserGridComponent;

  buttons: ButtonTemplate[] = [{
    text: '구글 로그인',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.test();
    }
  },{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getUserList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.newForm();
    }
  },{
    text: '삭제',
    nzType: 'delete',
    isDanger: true,
    popConfirm: {
      title: '삭제하시겠습니까?',
      confirmClick: () => {
        this.deleteUser();
      }
    }
  }];

  query: { key: string, value: string, list: {label: string, value: string}[] } = {
    key: 'userId',
    value: '',
    list: [
      {label: '아이디', value: 'userId'},
      {label: '성명', value: 'name'}
    ]
  }

  drawerUser: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  private service = inject(UserService);

  ngOnInit() {
  }

  newForm() {
    this.drawerUser.initLoadId = null;
    this.drawerUser.visible = true;

  }

  editForm(item: User) {
    console.log(item.userId);
    this.drawerUser.initLoadId = item.userId;
    this.drawerUser.visible = true;
  }

  getUserList() {
    let params: any = new Object();
    if ( this.query.value !== '') {
      params[this.query.key] = this.query.value;
    }

    this.drawerUser.visible = false;
    this.grid.getUserList(params);
  }

  deleteUser() {
    const userId: string = this.grid.getSelectedRow().userId;
    this.service
        .deleteUser(userId)
        .subscribe(
          (model: ResponseObject<User>) => {
            this.getUserList();
          }
        );
  }

  userGridSelected(params: any) {
    this.drawerUser.initLoadId = params.userId;
  }

  test() {
    window.location.href = 'http://localhost:8090/oauth2/authorization/google';
  }
}
