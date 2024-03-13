import { CommonModule } from '@angular/common';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

import { Component, OnInit, Output, EventEmitter, Input, inject, viewChild } from '@angular/core';
import { ResponseList } from '../../../core/model/response-list';
import { BoardHierarchy } from './board-hierarchy.model';
import { BoardHierarcyService } from './board-hierarcy.service';


@Component({
  standalone: true,
  selector: 'app-board-tree',
  imports: [
    CommonModule, NzTreeModule
  ],
  template: `
    <nz-tree
      #treeCom
      [nzData]="boardItems"
      [nzSelectedKeys]="selectedKeys"
      [nzSearchValue]="searchValue"
      (nzClick)="nzClick($event)"
      (nzDblClick)="nzDbClick($event)">
  </nz-tree>
  `,
  styles: ['']
})
export class BoardTreeComponent implements OnInit {

  treeCom = viewChild.required(NzTreeComponent);

  boardItems: BoardHierarchy[] = [];
  selectedKeys: string[] = [];

  @Input() searchValue = '';
  @Output() itemSelected = new EventEmitter();
  @Output() itemDbClicked = new EventEmitter();

  private boardService = inject(BoardHierarcyService);

  ngOnInit(): void {
    console.log('BoardTreeComponent init');
  }

  getboardHierarchy(): void {
    this.boardService
        .getBoardHierarchy()
        .subscribe(
          (model: ResponseList<BoardHierarchy>) => {
              if ( model.total > 0 ) {
                this.boardItems = model.data;
                console.log(this.boardItems[0].key);
                this.selectedKeys = [this.boardItems[0].key];
                this.itemSelected.emit(this.boardItems[0]);
              } else {
                this.boardItems = [];
              }

              // title 노드 텍스트
              // key   데이터 키
              // isLeaf 마지막 노드 여부
              // checked 체크 여부
          }
        );
  }

  nzClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

  public nzDbClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemDbClicked.emit(node);
  }

}
