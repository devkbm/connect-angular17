import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TodoModel } from './todo.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-todo-add-input',
  standalone: true,
  imports: [ CommonModule, FormsModule, NzButtonModule, NzInputModule ],
  template: `
    <button nz-button (click)="addTodo(newText)">add</button>
    <input nz-input placeholder="입력해주세요." [(ngModel)]="newText" (keyup.enter)="addTodo(newText)">

    <!--<button (click)="addTodo(newText)">+</button>-->
    <!--<button (click)="addTodo(newText)">+</button><input type="text" placeholder="할 일 추가" [(ngModel)]="newText" (keyup.enter)="addTodo(newText)">-->
  `,
  styles: [`
    :host {
      display: flex;
      background-color: grey;
      align-items: stretch;
    }
  `]
})
export class TodoAddInputComponent implements OnInit {

  @Input() pkTodoGroup: string = '';

  onTodoAdded = output<TodoModel>();

  newText: string;

  constructor() {
    this.newText = '';
  }

  ngOnInit() {
  }

  addTodo(newText: string) {
    const obj: TodoModel = {pkTodoGroup: this.pkTodoGroup, pkTodo: '', isCompleted: false, todo: newText};
    this.onTodoAdded.emit(obj);
    this.newText= '';
  }

}
