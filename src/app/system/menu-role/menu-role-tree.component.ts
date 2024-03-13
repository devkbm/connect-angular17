import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTreeComponent, NzTreeModule, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import { Component, OnInit, Output, EventEmitter, Input, inject, viewChild, input } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';

import { MenuRoleHierarchy } from '../menu/menu-role-hierarchy.model';
import { MenuRoleMapping } from '../menu/menu-role-mapping.model';
import { NzInputSelectComponent } from 'src/app/shared-component/nz-input-select/nz-input-select.component';

import { MenuRoleService } from './menu-role.service';



@Component({
  standalone: true,
  selector: 'app-menu-role-tree',
  imports: [ CommonModule, FormsModule, NzTreeModule, NzInputSelectComponent ],
  template: `
    <!--
    <button (click)="getCommonCodeHierarchy()">
        조회
    </button>
    -->
    {{searchValue}}
    <!--{{nodeItems | json}}-->
    {{saveNodes | json}}
    {{defaultCheckedKeys | json}}
    <button (click)="getHierarchy()">조회</button>
    <button (click)="save()">저장</button>
    <!--[(nzCheckedKeys)]="defaultCheckedKeys"-->
    <nz-tree
        #treeComponent
        nzCheckable
        [nzData]="nodeItems"
        [nzSearchValue]="searchValue"

        (nzCheckBoxChange)="nzCheck($event)"
        (nzClick)="nzClick($event)">
    </nz-tree>
    {{menuGroupCode()}} - {{roleCode()}}

  `,
  styles: ['']
})
export class MenuRoleTreeComponent implements OnInit {

  treeComponent = viewChild.required(NzTreeComponent);

  nodeItems: MenuRoleHierarchy[] = [];

  saveNodes: MenuRoleMapping[] = [];
  saveNodeKeys = new Set<string>();

  defaultCheckedKeys = ['1'];

  @Input() searchValue = '';
  @Output() itemSelected = new EventEmitter();

  menuGroupCode = input<string>();
  roleCode = input<string>();

  private menuService = inject(MenuRoleService);

  ngOnInit(): void {
  }

  public getHierarchy(): void {
    this.menuService
        .getMenuRoleHierarchy(this.menuGroupCode()!, this.roleCode()!)
        .subscribe(
            (model: ResponseList<MenuRoleHierarchy>) => {
                if ( model.total > 0 ) {
                this.nodeItems = model.data;
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
    console.log(this.treeComponent().getCheckedNodeList());
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
    /*
    var saveNodeKeys = new Set<string>();
    let saveNodes: {
      menuGroupCode: string;
      menuCode: string;
      roleCode: string;
    }[] = [];
    */
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
