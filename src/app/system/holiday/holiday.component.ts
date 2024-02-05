import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, formatDate, Location } from '@angular/common';

import { AppBase } from 'src/app/core/app/app-base';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HolidayGridComponent } from './holiday-grid.component';
import { HolidayService } from './holiday.service';
import { Holiday } from './holiday.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { HolidayFormComponent } from './holiday-form.component';


@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzDrawerModule,
    NzIconModule,
    NzButtonModule,
    NzDatePickerModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,
    HolidayGridComponent,
    HolidayFormComponent
  ],
  template: `
<app-nz-page-header-custom title="공휴일 등록" subtitle="This is a subtitle"></app-nz-page-header-custom>

<div nz-row class="btn-group">

  <div nz-col [nzSpan]="1" style="text-align: left;">
    <nz-date-picker nzMode="year" [(ngModel)]="query.year" nzAllowClear="false" style="width: 80px;"></nz-date-picker>
  </div>

  <div nz-col [nzSpan]="23" style="text-align: right;">
    <button nz-button (click)="getHolidayList()">
      <span nz-icon nzType="search"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button (click)="newHoliday()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzDanger
      nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
      (nzOnConfirm)="deleteHoliday()" (nzOnCancel)="false">
      <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
    </button>
  </div>
</div>

<h3 class="app-title">공휴일 목록</h3>

<div class="grid-wrapper">
  <app-holiday-grid
      #holidayGrid
      (rowSelected)="holidayGridRowClicked($event)"
      (editButtonClicked)="edit($event)"
      (rowDoubleClicked)="edit($event)">
  </app-holiday-grid>
</div>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="720"
    [nzVisible]="drawerHoliday.visible"
    nzTitle="휴일 등록"
    (nzOnClose)="closeDrawer()">
    <app-holiday-form #holidayForm *nzDrawerContent
      [initLoadId]="drawerHoliday.initLoadId"
      (formSaved)="getHolidayList()"
      (formDeleted)="getHolidayList()"
      (formClosed)="closeDrawer()">
    </app-holiday-form>
</nz-drawer>

  `,
  styles: `
.app-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.grid-wrapper {
  height: calc(100% - 180px)
}

[nz-button] {
  margin: auto;
}

  `
})
export class HolidayComponent extends AppBase implements OnInit, AfterViewInit {

  @ViewChild(HolidayGridComponent) grid!: HolidayGridComponent;

  query: { key: string, value: string, list: {label: string, value: string}[], year: Date } = {
    key: 'resourceCode',
    value: '',
    list: [
      {label: '휴일명', value: 'resourceCode'},
      {label: '비고', value: 'description'}
    ],
    year: new Date()
  }

  drawerHoliday: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  private service = inject(HolidayService);
  private appAlarmService = inject(AppAlarmService);

  ngAfterViewInit(): void {
    this.getHolidayList();
  }

  ngOnInit(): void {
  }

  openDrawer(): void {
    this.drawerHoliday.visible = true;
  }

  closeDrawer(): void {
    this.drawerHoliday.visible = false;
  }

  getHolidayList(): void {
    let params: any = new Object();
    if ( this.query.value !== '') {
      params[this.query.key] = this.query.value;
    }

    const date: Date = this.query.year;

    this.closeDrawer();
    this.grid.getGridList(date.getFullYear()+'0101', date.getFullYear()+'1231');
  }

  newHoliday(): void {
    this.drawerHoliday.initLoadId = null;
    this.openDrawer();
  }

  deleteHoliday(): void {
    const date = this.grid.getSelectedRows()[0].date;
    this.delete(date);
  }

  delete(date: Date): void {
    const id = formatDate(date, 'yyyyMMdd','ko-kr') as string;
    if (id === null) return;

    this.service
        .deleteHoliday(id)
        .subscribe(
          (model: ResponseObject<Holiday>) => {
            this.appAlarmService.changeMessage(model.message);
            this.getHolidayList();
          }
        );
  }

  holidayGridRowClicked(item: any): void {
    this.drawerHoliday.initLoadId = item.date;
  }

  edit(item: any): void {
    this.drawerHoliday.initLoadId = item.date;
    this.openDrawer();
  }
}
