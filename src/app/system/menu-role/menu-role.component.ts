import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';

import { MenuRoleTreeComponent } from './menu-role-tree.component';
import { ResponseList } from 'src/app/core/model/response-list';

import { MenuGroup } from '../menu/menu-group.model';
import { Role } from '../role/role.model';
import { UserService } from '../user/user.service';
import { MenuService } from '../menu/menu.service';
import { MenuGroupGridComponent } from '../menu/menu-group-grid.component';
import { RoleGridComponent } from '../role/role-grid.component';
import { RoleFormComponent } from '../role/role-form.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MenuGridComponent } from '../menu/menu-grid.component';

@Component({
  selector: 'app-menu-role',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzDrawerModule, NzInputSelectComponent,
    MenuGroupGridComponent, MenuGridComponent, RoleGridComponent, RoleFormComponent, MenuRoleTreeComponent
  ],
  template: `
    <button nz-button (click)="newRole()">신규 롤</button>
    <div nz-col nzSpan="12">
      <app-nz-input-select
        [(ngModel)]="menuGroup.selectedItem"
        [options]="menuGroup.list" [opt_value]="'menuGroupCode'" [opt_label]="'menuGroupName'"
        [placeholder]="'Please select'"
        [required]="true">메뉴그룹
      </app-nz-input-select>
    </div>
    <div nz-col nzSpan="12">
      <app-nz-input-select
        [(ngModel)]="role.selectedItem"
        [options]="role.list" [opt_value]="'roleCode'" [opt_label]="'description'"
        [placeholder]="'Please select'"
        [required]="true">롤
      </app-nz-input-select>
    </div>

    <div class="page-content">
      <app-menu-group-grid class="grid1" (rowClicked)="menuGroupClicked($event)"></app-menu-group-grid>

      <app-menu-grid></app-menu-grid>

      <app-role-grid class="grid3"
        (rowClicked)="roleClicked($event)"
        (editButtonClicked)="editDrawOpen($event)"
        (rowDoubleClicked)="editDrawOpen($event)">
      </app-role-grid>


      <app-menu-role-tree class="tree"
        [menuGroupCode]="menuGroup.selectedItem"
        [roleCode]="role.selectedItem">
      </app-menu-role-tree>
    </div>


    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px'}"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer.role.visible"
      nzTitle="롤 등록"
      (nzOnClose)="closeDrawer('role')">
        <app-role-form #form *nzDrawerContent
          [initLoadId]="drawer.role.initLoadId"
          (formSaved)="getRoleList()"
          (formDeleted)="getRoleList()"
          (formClosed)="closeDrawer('role')">
        </app-role-form>
    </nz-drawer>
  `,
  styles: `
  :host {
    --page-header-height: 98px;
    --page-search-height: 46px;
    --page-content-title-height: 26px;
    --page-content-title-margin-height: 6px;
    --page-content-margin-height: 6px;
  }

  .page-header {
    height: var(--page-header-height);
  }

  .page-search {
    height: var(--page-search-height);
  }

  .page-content-title {
    height: var(--page-content-title-height);
  }

  .page-content {
    margin-top: var(--page-content-margin-height);
    height: calc(100vh - (
                          var(--app-header-height) +
                          var(--app-footer-height) +
                          var(--page-header-height) +
                          var(--page-search-height) +
                          var(--page-content-margin-height)
                        )
                );
    /*height: 900px;*/
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 0.6fr 0.4fr;
    column-gap: 12px;
    row-gap: 12px;
    grid-template-areas:
      "grid1  grid3 tree"
      "grid2  grid3  tree";
  }

  .grid1 {
    grid-area: grid1;
  }

  .grid2 {
    grid-area: grid2;
  }

  .grid3 {
    grid-area: grid3;
  }

  .tree {
    grid-area: tree;
  }

  `
})
export class MenuRoleComponent {

  menuGroup: {list: any, selectedItem: string} = {list: [], selectedItem: ''};
  role: {list: any, selectedItem: string} = {list: [], selectedItem: ''};

  private menuService = inject(MenuService);
  private userService = inject(UserService);

  roleGrid = viewChild.required(RoleGridComponent);
  menuGroupGrid = viewChild.required(MenuGroupGridComponent);
  menuGrid = viewChild.required(MenuGridComponent);

  drawer: {
    menuGroup: { visible: boolean, initLoadId: any },
    menu: { visible: boolean, initLoadId: any },
    role: { visible: boolean, initLoadId: any }
  } = {
    menuGroup: { visible: false, initLoadId: null },
    menu: { visible: false, initLoadId: null },
    role: { visible: false, initLoadId: null }
  }

  constructor() {
    this.getMenuGroupList();
    this.getRoleList();
  }

  getMenuGroupList(): void {
    this.menuService
        .getMenuGroupList()
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            if (model.total > 0) {
              this.menuGroup.list = model.data;
            }
          }
        );
  }

  getRoleList(): void {
    this.userService
        .getAuthorityList()
        .subscribe(
          (model: ResponseList<Role>) => {
            if (model.total > 0) {
              this.role.list = model.data;
            }
          }
        );
  }

  menuGroupClicked(args: any) {
    console.log(args);
    this.menuGroup.selectedItem = args.menuGroupCode;
    this.role.selectedItem = '';
    this.roleGrid().getList({menuGroupCode: this.menuGroup.selectedItem});

    this.menuGrid().getMenuList({menuGroupCode: this.menuGroup.selectedItem});
  }

  roleClicked(args: any) {
    console.log(args);
    this.role.selectedItem = args.roleCode;
    this.drawer.role.initLoadId = args.roleCode;
  }

  openDrawer(type: any) {
    if (type === 'role') {
      this.drawer.role.visible = true;
    }

  }

  closeDrawer(type: any) {
    if (type === 'role') {
      this.drawer.role.visible = false;
    }
  }

  editDrawOpen(args: any) {
    this.openDrawer('role');
  }

  newRole() {
    this.drawer.role.initLoadId = null;
    this.openDrawer('role');
  }

}
