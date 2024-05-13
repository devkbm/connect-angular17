import { CommonModule } from '@angular/common';
import { Component, inject, viewChild, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTreeComponent, NzTreeModule, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import { ResponseList } from 'src/app/core/model/response-list';

import { MenuRoleHierarchy } from '../menu/menu-role-hierarchy.model';
import { MenuRoleMapping } from '../menu/menu-role-mapping.model';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';

import { MenuRoleService } from './menu-role.service';
import { NzTreeNodeKey } from 'ng-zorro-antd/core/tree';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-menu-role-tree',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTreeModule, NzButtonComponent, NzInputSelectComponent],
  template: `
    <!--{{defaultCheckedKeys | json}}-->
    <!--{{saveNodes | json}}-->
    <button nz-button (click)="getHierarchy()">조회</button>
    <button nz-button (click)="save()">저장</button>

    <nz-tree
        #treeComponent
        nzCheckable
        [nzData]="nodeItems"
        [nzSearchValue]="searchValue()"
        [nzCheckedKeys]="defaultCheckedKeys"
        (nzCheckBoxChange)="nzCheck($event)"
        (nzClick)="nzClick($event)">
    </nz-tree>
    <!--{{menuGroupCode()}} - {{roleCode()}}-->

  `,
  styles: `
  `
})
export class MenuRoleTreeComponent {

  treeComponent = viewChild.required(NzTreeComponent);

  nodeItems: MenuRoleHierarchy[] = [];
  defaultCheckedKeys: NzTreeNodeKey[] = [];

  saveNodes: MenuRoleMapping[] = [];
  saveNodeKeys = new Set<string>();

  menuGroupCode = input.required<string>();
  roleCode = input.required<string>();

  searchValue = input<string>('');

  itemSelected = output<any>();

  private menuService = inject(MenuRoleService);

  constructor() {
    effect(() => {
      if (this.menuGroupCode() && this.roleCode()) {
        this.getHierarchy();
      }
    });
  }

  public getHierarchy(): void {
    this.menuService
        .getMenuRoleHierarchy(this.menuGroupCode(), this.roleCode())
        .subscribe(
            (model: ResponseList<MenuRoleHierarchy>) => {
              if ( model.total > 0 ) {
                this.nodeItems = model.data;

                this.defaultCheckedKeys = this.nodeItems.flatMap(e => [e, ...e.children || []]).map(e => e.checked ? e.key : -1).filter(val => val !== -1);
                //console.log(this.defaultCheckedKeys);
              } else {
                this.nodeItems = [];
              }
            }
        );
  }

  nzClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    //console.log(this.treeComponent().getCheckedNodeList());
    //console.log(this.treeComponent().getHalfCheckedNodeList());
    //console.log(event);

    this.setSaveNodes();
  }

  save() {
    this.setSaveNodes();

    this.menuService
        .saveMenuRoleMapping(this.saveNodes)
        .subscribe(
          (model: ResponseList<MenuRoleMapping>) => {
            this.getHierarchy();
          }
        );

  }

  setSaveNodes() {
    this.saveNodeKeys.clear();
    this.saveNodes = [];

    const nodes: NzTreeNode[] = this.treeComponent().getCheckedNodeList();
    for (var node of nodes) {
      const menu_role = node.origin as MenuRoleHierarchy;
      this.saveNodeKeys.add(menu_role.menuGroupCode + menu_role.menuCode + menu_role.roleCode);
      this.saveNodes.push({
        menuGroupCode: menu_role.menuGroupCode,
        menuCode: menu_role.menuCode,
        roleCode: menu_role.roleCode
      });

      if (node.children !== null) {
        for (var childNode of node.children) {
          const child_menu_role = childNode.origin as MenuRoleHierarchy;
          if (!this.saveNodeKeys.has(child_menu_role.menuGroupCode+ child_menu_role.menuCode + child_menu_role.roleCode)) {
            this.saveNodeKeys.add(child_menu_role.menuGroupCode + child_menu_role.menuCode + child_menu_role.roleCode);
            this.saveNodes.push({
              menuGroupCode: child_menu_role.menuGroupCode,
              menuCode: child_menu_role.menuCode,
              roleCode: child_menu_role.roleCode
            });
          }
        }
      }
      //console.log(menu_role.children);
    }

    // 하위 노드 중 일부만 선택(HalfChecked)되어있을 경우 상위 노드도 포함
    const halfCheckedNodes: NzTreeNode[] = this.treeComponent().getHalfCheckedNodeList();
    for (var node of halfCheckedNodes) {
      const menu_role = node.origin as MenuRoleHierarchy;
      if (!this.saveNodeKeys.has(menu_role.menuGroupCode+ menu_role.menuCode + menu_role.roleCode)) {
        this.saveNodeKeys.add(menu_role.menuGroupCode + menu_role.menuCode + menu_role.roleCode);
        this.saveNodes.push({
          menuGroupCode: menu_role.menuGroupCode,
          menuCode: menu_role.menuCode,
          roleCode: menu_role.roleCode
        });
      }
    }
  }

}
