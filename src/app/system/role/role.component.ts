import { CommonModule } from '@angular/common';

import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';

import { AppBase } from 'src/app/core/app/app-base';
import { ResponseObject } from 'src/app/core/model/response-object';

import { RoleGridComponent } from './role-grid.component';
import { RoleService } from './role.service';
import { Role } from './role.model';

import { ButtonTemplate, NzButtonsComponent } from 'src/app/shared-component/nz-buttons/nz-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/shared-component/nz-search-area/nz-search-area.component';
import { RoleFormComponent } from './role-form.component';

@Component({
  selector: 'app-authority',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    /* NG-ZORRO  */
    NzButtonModule,
    NzPopconfirmModule,
    NzGridModule,
    NzSelectModule,
    NzInputModule,
    NzDrawerModule,
    NzDividerModule,
    /* Shared Component */
    NzButtonsComponent,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,

    RoleGridComponent,
    RoleFormComponent
  ],
  template: `
<app-nz-page-header-custom title="롤 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<app-nz-search-area>
  <div nz-col [nzSpan]="12">
    <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
      <input type="text" [(ngModel)]="queryValue" nz-input placeholder="input search text" (keyup.enter)="getRoleList()">
    </nz-input-group>
    <ng-template #addOnBeforeTemplate>
      <nz-select [(ngModel)]="queryKey">
        @for (option of queryOptionList; track option.value) {
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
  </div>
</app-nz-search-area>

<h3 class="grid-title">롤 목록</h3>

<div class="grid-wrapper">
  <app-authority-grid #authGrid
    (rowClicked)="selectedItem($event)"
    (editButtonClicked)="editDrawOpen($event)"
    (rowDoubleClicked)="editDrawOpen($event)">
  </app-authority-grid>
</div>


<nz-drawer #drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px'}"
  [nzMaskClosable]="true"
  [nzWidth]="720"
  [nzVisible]="drawerRole.visible"
  nzTitle="롤 등록"
  (nzOnClose)="closeDrawer()">
    <app-authority-form #form *nzDrawerContent
      [initLoadId]="drawerRole.initLoadId"
      (formSaved)="getRoleList()"
      (formDeleted)="getRoleList()"
      (formClosed)="closeDrawer()">
    </app-authority-form>
</nz-drawer>


  `,
  styles: `
.grid-title {
  height: 16px;
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

[nz-button] {
  margin: auto;
}
  `
})
export class RoleComponent extends AppBase implements AfterViewInit {

  private service = inject(RoleService);

  @ViewChild(RoleGridComponent) grid!: RoleGridComponent;

  queryOptionList = [
    {label: '롤', value: 'roleCode'},
    {label: '설명', value: 'description'}
  ];
  queryKey = 'authorityCode';
  queryValue = '';

  drawerRole: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  buttons: ButtonTemplate[] = [{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getRoleList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.initForm();
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


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  openDrawer(): void {
    this.drawerRole.visible = true;
  }

  closeDrawer(): void {
    this.drawerRole.visible = false;
  }

  selectedItem(data: any): void {
    if (data) {
      this.drawerRole.initLoadId = data.roleCode;
    } else {
      this.drawerRole.initLoadId = null;
    }
  }

  initForm(): void {
    this.drawerRole.initLoadId = null;

    this.openDrawer();
  }

  editDrawOpen(item: any): void {
    this.openDrawer();
  }

  getRoleList(): void {
    let params: any = new Object();
    if ( this.queryValue !== '') {
      params[this.queryKey] = this.queryValue;
    }

    this.closeDrawer();
    this.grid?.getList(params);
  }

  delete(): void {
    const id = this.grid.getSelectedRows()[0].roleCode;

    this.service
        .deleteRole(id)
        .subscribe(
          (model: ResponseObject<Role>) => {
            this.getRoleList();
          }
        );
  }

}
