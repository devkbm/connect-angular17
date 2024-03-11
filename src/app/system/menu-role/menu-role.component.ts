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

@Component({
  selector: 'app-menu-role',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzInputSelectComponent, MenuRoleTreeComponent
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

    <app-menu-role-tree
      [menuGroupCode]="menuGroup.selectedItem"
      [roleCode]="role.selectedItem">
    </app-menu-role-tree>
  `,
  styles: `
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

}
