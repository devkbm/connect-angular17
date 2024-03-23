import { Component, OnInit, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-nz-search-area',
  template: `
    <div class="search-area" [style.height]="height()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .search-area {
      overflow: visible;
      background-color: green;

      padding: 6px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding-left: auto;
      padding-right: 5;
    }
  `]
})
export class NzSearchAreaComponent {
  height = input<any>();

}
