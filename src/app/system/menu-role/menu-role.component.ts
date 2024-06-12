import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';

import { MenuRoleTreeComponent } from './menu-role-tree.component';
import { ResponseList } from 'src/app/core/model/response-list';

import { MenuGroup } from '../menu/menu-group.model';
import { Role } from '../role/role.model';
import { UserService } from '../user/user.service';
import { MenuService } from '../menu/menu.service';
import { MenuGroupGridComponent } from '../menu/menu-group-grid.component';
import { RoleGridComponent } from '../role/role-grid.component';

@Component({
  selector: 'app-menu-role',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzInputSelectComponent,
    MenuRoleTreeComponent, MenuGroupGridComponent, RoleGridComponent
  ],
  template: `
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

      <app-role-grid class="grid2" (rowClicked)="roleClicked($event)"></app-role-grid>

      <app-menu-role-tree class="tree"
        [menuGroupCode]="menuGroup.selectedItem"
        [roleCode]="role.selectedItem">
      </app-menu-role-tree>
    </div>
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
    grid-template-columns: 1fr 0.3fr;
    column-gap: 12px;
    row-gap: 12px;
    grid-template-areas:
      "grid1  tree"
      "grid2  tree";
  }

  .grid1 {
    grid-area: grid1;
  }

  .grid2 {
    grid-area: grid2;
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
  }

  roleClicked(args: any) {
    console.log(args);
    this.role.selectedItem = args.roleCode;
  }

}
