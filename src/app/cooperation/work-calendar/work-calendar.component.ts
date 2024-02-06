import { Component, OnInit, ViewChild } from '@angular/core';

import { DaypilotCalendarNavigatorComponent } from 'src/app/shared-component/calendar/daypilot-calendar-navigator.component';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { ModeChangedArgs } from 'src/app/shared-component/calendar/daypilot-calendar.component';

import { NewDateSelectedArgs, WorkCalendarViewComponent } from './calendar-view/work-calendar-view.component';
import { NewFormValue, WorkCalendarEventFormComponent } from './event/work-calendar-event-form.component';
import { MyWorkCalendarGridComponent } from './calendar/my-work-calendar-grid.component';
import { WorkCalendarFormComponent } from './calendar/work-calendar-form.component';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CalendarModule } from 'src/app/shared-component/calendar/calendar.module';
import { MyWorkCalendarListComponent } from './calendar/my-work-calendar-list.component';

@Component({
  selector: 'app-work-calendar',
  standalone: true,
  imports: [
    CommonModule,
    NzDrawerModule,
    NzButtonModule,
    NzIconModule,
    CalendarModule,
    MyWorkCalendarListComponent,
    MyWorkCalendarGridComponent,
    WorkCalendarFormComponent,
    WorkCalendarViewComponent,
    WorkCalendarEventFormComponent
  ],
  template: `
<button nz-button (click)="getMyWorkGroupList()">
  <span nz-icon nzType="search" nzTheme="outline"></span>
  조회
</button>

<button nz-button (click)="newWorkGroup()">
  <span nz-icon nzType="form" nzTheme="outline"></span>
  신규 CALENDAR
</button>

<button nz-button (click)="newSchedule()">
  <span nz-icon nzType="form" nzTheme="outline"></span>
  신규 일정
</button>

<div class="grid-wrapper">
  <app-daypilot-calendar-navigator #navigator
    class="navi"
    [events]="this.eventData"
    (selectChanged)="navigatorSelectChanged($event)">
  </app-daypilot-calendar-navigator>

  <app-my-work-calendar-grid class="title"
      #myWorkGroupGrid
      (rowSelected)="workGroupSelect($event)"
      (rowDoubleClicked)="modifyWorkGroup($event)">
  </app-my-work-calendar-grid>

  <!--
  <app-my-work-calendar-list class="title"
    (rowSelected)="workGroupSelect($event)"
    (rowDoubleClicked)="modifyWorkGroup($event)">
  </app-my-work-calendar-list>
  -->

  <app-work-calendar-view
      #workCalendar class="calendar"
      [fkWorkCalendar]="workGroup.selectedWorkGroupId"
      (itemSelected)="editSchedule($event)"
      (newDateSelected)="newScheduleByDateSelect($event)"
      (eventDataChanged)="eventDateChanged($event)"
      (visibleRangeChanged)="calendarVisibleRangeChanged($event)"
      (modeChanged)="modeChanged($event)">
  </app-work-calendar-view>
</div>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="720"
    [nzVisible]="schedule.visible"
    nzTitle="일정 등록"
    (nzOnClose)="closeScheduleDrawer()">

    <app-work-calendar-event-form *nzDrawerContent
        #workScheduleForm
        [initLoadId]="this.schedule.selectedScheduleId"
        [newFormValue]="this.newScheduleArgs"
        (formSaved)="getScheduleList()"
        (formDeleted)="getScheduleList()"
        (formClosed)="closeScheduleDrawer()">
    </app-work-calendar-event-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="720"
    [nzVisible]="workGroup.visible"
    nzTitle="CALENDAR 등록"
    (nzOnClose)="closeWorkGroupDrawer()">

    <app-work-calendar-form *nzDrawerContent
        #workGroupForm
        (formSaved)="getMyWorkGroupList()"
        (formDeleted)="getMyWorkGroupList()"
        (formClosed)="closeWorkGroupDrawer()">
    </app-work-calendar-form>
</nz-drawer>

  `,
  styles: `
.grid-wrapper {
  height: calc(100% - 32px);
  display: grid;

  grid-template-rows: 220px 1fr;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "navi calendar"
    "title calendar";
}

.navi {
  grid-area: navi;
  padding-top: 10px
}
.title {
  grid-area: title;
}
.calendar {
  grid-area: calendar;
}

  `
})
export class WorkCalendarComponent implements OnInit {

  @ViewChild('myWorkGroupGrid', {static: true}) myWorkGroupGrid!: MyWorkCalendarGridComponent;
  @ViewChild('workCalendar', {static: true}) workCalendar!: WorkCalendarViewComponent;
  @ViewChild('workScheduleForm', {static: false}) workScheduleForm!: WorkCalendarEventFormComponent;
  @ViewChild('workGroupForm', {static: false}) workGroupForm!: WorkCalendarFormComponent;

  @ViewChild('navigator', {static: true}) navigator!: DaypilotCalendarNavigatorComponent;

  //scheduleDrawerVisible: boolean = false;

  mode: "Day" | "Week" | "Month" | "None" = 'Month';

  //selectedWorkGroupId: number = -1;
  //selectedScheduleId: number = -1;
  newScheduleArgs?: NewFormValue;
  eventData: any[] = [];

  workGroup: { visible: boolean, selectedWorkGroupId: number } = {
    visible: false,
    selectedWorkGroupId: -1
  }

  schedule: { visible: boolean, selectedScheduleId: number} = {
    visible : false,
    selectedScheduleId: -1
  }

  ngOnInit(): void {
    this.getMyWorkGroupList();
  }

  getMyWorkGroupList(): void {
    this.closeWorkGroupDrawer();
    this.myWorkGroupGrid.getMyWorkGroupList();
  }

  getScheduleList(): void {
    this.closeWorkGroupDrawer();
    this.closeScheduleDrawer();

    this.workCalendar.fkWorkCalendar = this.workGroup.selectedWorkGroupId;
    this.workCalendar.getWorkScheduleList();
  }

  openScheduleDrawer() {
    this.schedule.visible = true;
  }

  closeScheduleDrawer() {
    this.schedule.visible = false;

    this.workCalendar.fkWorkCalendar = this.workGroup.selectedWorkGroupId;
    this.workCalendar.getWorkScheduleList();
  }

  openWorkGroupDrawer() {
    this.workGroup.visible = true;
  }

  closeWorkGroupDrawer() {
    this.workGroup.visible = false;
  }

  newWorkGroup(): void {
    this.openWorkGroupDrawer();

    setTimeout(() => {
      this.workGroupForm.newForm();
    },50);
  }

  modifyWorkGroup(workGroup: any): void {
    this.openWorkGroupDrawer();

    setTimeout(() => {
      this.workGroupForm.get(workGroup.id);
    },50);
  }

  newSchedule(): void {
    this.openScheduleDrawer();

    const today: Date = new Date();
    const from: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0);
    const to: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 1, 0);
    this.newScheduleArgs = {workCalendarId: this.workGroup.selectedWorkGroupId, start: from, end: to};
    this.schedule.selectedScheduleId = -1;
  }

  newScheduleByDateSelect(param: NewDateSelectedArgs) {
    console.log('newScheduleByDateSelect: start');
    if (param.workCalendarId === -1) {
      alert('작업그룹을 선택해주세요.');
      return;
    }

    console.log(param);

    this.navigator.date = new DayPilot.Date(param.start, true);
    this.newScheduleArgs = {workCalendarId: this.workGroup.selectedWorkGroupId, start: param.start, end: param.end};
    this.schedule.selectedScheduleId = -1;

    this.openScheduleDrawer();
    console.log('newScheduleByDateSelect: end');
  }

  editSchedule(id: any) {
    this.schedule.selectedScheduleId = id;
    this.newScheduleArgs = undefined;

    this.openScheduleDrawer();
  }

  workGroupSelect(ids: any): void {
    this.workGroup.selectedWorkGroupId = ids;
    this.getScheduleList();
  }

  eventDateChanged(event: any) {
    this.eventData = event;
  }

  calendarVisibleRangeChanged(params: any) {
    /*
    if (this.mode === 'Month') {
      this.navigator.date = new DayPilot.Date(params.date, true);
    } else {
      this.navigator.date = new DayPilot.Date(params.start, true);
    }
    */
  }

  modeChanged(params: ModeChangedArgs): void {
    this.mode = params.mode;
  }

  navigatorSelectChanged(params: any) {
    this.workCalendar.calendarSetDate(new DayPilot.Date(params.start, true));
  }

}
