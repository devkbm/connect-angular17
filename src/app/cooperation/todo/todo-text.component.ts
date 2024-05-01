import { Component, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { TodoModel } from './todo.model';

@Component({
  selector: 'app-todo-text',
  standalone: true,
  imports: [CommonModule, FormsModule, NzCheckboxModule, NzButtonModule],
  template: `
    <label nz-checkbox [(ngModel)]="todo().isCompleted" (change)="changeState()"></label>
    <label (click)="toggleState()" [class.line-break]="todo().isCompleted"> {{ todo().todo }} </label>
    <button nz-button nzType="primary" nzDanger (click)="deleteTodo()">delete</button>
  `,
  styles: `
    :host {
      display: block;
      /*padding: 16px;*/
      color: darkgray;
      background-color: white;
    }

    .line-break {
      text-decoration: line-through;
    }
  `
})
export class TodoTextComponent {

  //@Input({required: true}) todo!: TodoModel;
  todo = model.required<TodoModel>();

  stateChanged = output<any>();
  deleteClicked = output<TodoModel>();

  constructor() {}

  changeState() {
    this.stateChanged.emit(this.todo());
  }

  toggleState() {
    this.stateChanged.emit(this.todo());
  }

  deleteTodo() {
    this.deleteClicked.emit(this.todo());
  }


}
