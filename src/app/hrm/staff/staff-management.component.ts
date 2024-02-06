import { CommonModule, Location } from '@angular/common';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { Component, OnInit, ViewChild } from '@angular/core';

import { AppBase } from 'src/app/core/app/app-base';
import { StaffRegistFormComponent } from './staff-regist-form.component';
import { StaffGridComponent } from './staff-grid.component';
import { StaffAppointmentRecordGridComponent } from './staff-appointment-record/staff-appointment-record-grid.component';
import { StaffFamilyGridComponent } from './staff-family/staff-family-grid.component';
import { StaffFamily } from './staff-family/staff-family.model';
import { StaffLicense } from './staff-license/staff-license.model';
import { StaffLicenseGridComponent } from './staff-license/staff-license-grid.component';
import { StaffAppointmentRecord } from './staff-appointment-record/staff-appointment-record.model';
import { StaffSchoolCareer } from './staff-school-career/staff-school-career.model';
import { StaffSchoolCareerGridComponent } from './staff-school-career/staff-school-career-grid.component';
import { StaffCurrentAppointmentDescriptionComponent } from './staff-current-appointment-description.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { NewStaffFormComponent } from './new-staff-form/new-staff-form.component';
import { StaffAppointmentRecordFormComponent } from './staff-appointment-record/staff-appointment-record-form.component';
import { StaffCardListComponent } from './staff-card/staff-card-list.component';
import { StaffCardComponent } from './staff-card/staff-card.component';
import { StaffContactFormComponent } from './staff-contact/staff-contact-form.component';
import { StaffDutyResponsibilityFormComponent } from './staff-duty-responsibility/staff-duty-responsibility-form.component';
import { StaffDutyResponsibilityListComponent } from './staff-duty-responsibility/staff-duty-responsibility-list.component';
import { StaffFamilyFormComponent } from './staff-family/staff-family-form.component';
import { StaffLicenseFormComponent } from './staff-license/staff-license-form.component';
import { StaffSchoolCareerFormComponent } from './staff-school-career/staff-school-career-form.component';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzDrawerModule,
    NzTabsModule,
    NzCollapseModule,
    NzDividerModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,

    NzPageHeaderCustomComponent,

    StaffAppointmentRecordGridComponent,
    StaffFamilyGridComponent,
    StaffLicenseGridComponent,
    StaffSchoolCareerGridComponent,
    NewStaffFormComponent,
    StaffAppointmentRecordFormComponent,
    StaffContactFormComponent,
    StaffDutyResponsibilityFormComponent,
    StaffFamilyFormComponent,
    StaffLicenseFormComponent,
    StaffSchoolCareerFormComponent,
    StaffRegistFormComponent,
    StaffGridComponent,
    StaffCurrentAppointmentDescriptionComponent,
    StaffCardComponent,
    StaffCardListComponent,
    StaffDutyResponsibilityListComponent
  ],
  template: `
<app-nz-page-header-custom title="직원정보관리" subtitle="This is a subtitle"></app-nz-page-header-custom>

<div nz-row class="btn-group">

  <div nz-col [nzSpan]="24" style="text-align: right;">
    {{selectedStaff | json}}
    <button nz-button (click)="selectGridStaff()">
      <span nz-icon nzType="search" nzTheme="outline"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzType="primary" (click)="newStaff()">
      <span nz-icon nzType="save" nzTheme="outline"></span>신규직원등록
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzType="primary" (click)="newDutyResponsibility()">
      <span nz-icon nzType="save" nzTheme="outline"></span>직책등록
    </button>
  </div>
</div>

<div class="app-grid">
  <app-staff-grid
    (rowClickedEvent)="staffGridRowClicked($event)">
  </app-staff-grid>

  <div>
    <app-staff-regist-form [staffNo]="selectedStaff?.staffNo">
    </app-staff-regist-form>
    <nz-collapse>
      <nz-collapse-panel [nzHeader]="'발령'">
        <app-staff-current-appointment-description [staffNo]="selectedStaff?.staffNo">
        </app-staff-current-appointment-description>
      </nz-collapse-panel>
      <nz-collapse-panel [nzHeader]="'보직'">
        <div style="height:100px; padding: 0px; margin: 0px;">
          <app-staff-duty-responsibility-list
            [staffId]="selectedStaff?.staffNo">
          </app-staff-duty-responsibility-list>
        </div>
      </nz-collapse-panel>
    </nz-collapse>
  </div>


  <div>
    <nz-tabset [nzAnimated]="false">
      <nz-tab nzTitle="연락처">
        <div class="tab-grid">
          <app-staff-contact-form
            [staff]="selectedStaff"
            (formSaved)="selectGridAppointment()"
            (formDeleted)="selectGridAppointment()"
            (formClosed)="drawerContact.visible = false">
          </app-staff-contact-form>
        </div>
      </nz-tab>

      <nz-tab nzTitle="발령기록">
        <button nz-button nzType="primary" (click)="newAppoint()">
          <span nz-icon nzType="save" nzTheme="outline"></span>발령등록
        </button>
        <div class="tab-grid">
          <app-staff-appointment-record-grid
            [staffNo]="selectedStaff?.staffNo"
            (editButtonClicked)="editAppointment($event)"
            (rowDoubleClicked)="editAppointment($event)">
          </app-staff-appointment-record-grid>
        </div>
      </nz-tab>

      <nz-tab nzTitle="가족">
        <button nz-button nzType="primary" (click)="newFamily()">
          <span nz-icon nzType="save" nzTheme="outline"></span>가족등록
        </button>
        <div class="tab-grid">
          <app-staff-family-grid
            [staffId]="selectedStaff?.staffNo"
            (editButtonClicked)="editFamily($event)"
            (rowDoubleClicked)="editFamily($event)">
          </app-staff-family-grid>
        </div>
      </nz-tab>

      <nz-tab nzTitle="학력">
        <button nz-button nzType="primary" (click)="newSchoolCareer()">
          <span nz-icon nzType="save" nzTheme="outline"></span>학력등록
        </button>
        <div class="tab-grid">
          <app-staff-school-career-grid
            [staffId]="selectedStaff?.staffNo"
            (editButtonClicked)="editSchoolCareer($event)"
            (rowDoubleClicked)="editSchoolCareer($event)">
          </app-staff-school-career-grid>
        </div>
      </nz-tab>

      <nz-tab nzTitle="자격면허">
        <button nz-button nzType="primary" (click)="newLicense()">
          <span nz-icon nzType="save" nzTheme="outline"></span>자격면허등록
        </button>
        <div class="tab-grid">
          <app-staff-license-grid
            [staffId]="selectedStaff?.staffNo"
            (editButtonClicked)="editLicense($event)"
            (rowDoubleClicked)="editLicense($event)">
          </app-staff-license-grid>
        </div>
      </nz-tab>

      <nz-tab nzTitle="카드명단">
        <div class="tab-grid">
          <app-staff-card-list>
          </app-staff-card-list>
        </div>
      </nz-tab>

    </nz-tabset>
  </div>

</div>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerNewStaff.visible"
  nzTitle="직원 등록"
  (nzOnClose)="drawerNewStaff.visible = false">
    <!-- (formSaved)="getForm(newStaff.selectedRowId)" -->
    <app-new-staff-form *nzDrawerContent
      [initLoadId]="drawerNewStaff.initLoadId"
      (formSaved)="selectGridStaff()"
      (formDeleted)="selectGridStaff()"
      (formClosed)="drawerNewStaff.visible = false">
    </app-new-staff-form>
</nz-drawer>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerAppointment.visible"
  nzTitle="발령 등록"
  (nzOnClose)="drawerAppointment.visible = false">
    <app-staff-appointment-record-form *nzDrawerContent
      [staff]="selectedStaff"
      [initLoadId]="drawerAppointment.initLoadId"
      (formSaved)="selectGridAppointment()"
      (formDeleted)="selectGridAppointment()"
      (formClosed)="drawerAppointment.visible = false">
    </app-staff-appointment-record-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerDutyResponsibility.visible"
  nzTitle="직책 등록"
  (nzOnClose)="drawerDutyResponsibility.visible = false">
  <!--(formSaved)="selectGridAppointment()"
      (formDeleted)="selectGridAppointment()"-->
    <app-staff-duty-responsibility-form *nzDrawerContent
      [staff]="selectedStaff"
      [initLoadId]="drawerDutyResponsibility.initLoadId"
      (formClosed)="drawerDutyResponsibility.visible = false">
    </app-staff-duty-responsibility-form>
</nz-drawer>


<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerContact.visible"
  nzTitle="연락처 등록"
  (nzOnClose)="drawerContact.visible = false">
    <app-staff-contact-form *nzDrawerContent
      [initLoadId]="drawerContact.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridAppointment()"
      (formDeleted)="selectGridAppointment()"
      (formClosed)="drawerContact.visible = false">
    </app-staff-contact-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerFamily.visible"
  nzTitle="가족 등록"
  (nzOnClose)="drawerFamily.visible = false">
    <app-staff-family-form *nzDrawerContent
      [initLoadId]="drawerFamily.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridFaimly()"
      (formDeleted)="selectGridFaimly()"
      (formClosed)="drawerFamily.visible = false">
    </app-staff-family-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerSchoolCareer.visible"
  nzTitle="학력 등록"
  (nzOnClose)="drawerSchoolCareer.visible = false">
    <app-staff-school-career-form *nzDrawerContent
      [initLoadId]="drawerSchoolCareer.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridSchoolCareer()"
      (formDeleted)="selectGridSchoolCareer()"
      (formClosed)="drawerSchoolCareer.visible = false">
    </app-staff-school-career-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawerLicense.visible"
  nzTitle="자격면허 등록"
  (nzOnClose)="drawerLicense.visible = false">
    <app-staff-license-form *nzDrawerContent
      [initLoadId]="drawerLicense.initLoadId"
      [staff]="selectedStaff"
      (formSaved)="selectGridLicense()"
      (formDeleted)="selectGridLicense()"
      (formClosed)="drawerLicense.visible = false">
    </app-staff-license-form>
</nz-drawer>

  `,
  styles: `
.app-grid {
  display: grid;
  /*grid-auto-flow: column;*/
  grid-template-rows: 1fr;
  grid-template-columns: 200px 400px 1fr;
  column-gap: 10px;
  margin-top: 10px;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.tab-grid {
  height: calc(100vh - 336px);
}
  `
})
export class StaffManagementComponent extends AppBase implements OnInit {

  @ViewChild(StaffGridComponent) gridStaff!: StaffGridComponent;
  @ViewChild(StaffRegistFormComponent) formStaff!: StaffRegistFormComponent;
  @ViewChild(StaffCurrentAppointmentDescriptionComponent) staffDesc!: StaffCurrentAppointmentDescriptionComponent;
  @ViewChild(StaffAppointmentRecordGridComponent) gridAppointment!: StaffAppointmentRecordGridComponent;
  @ViewChild(StaffFamilyGridComponent) gridFamily!: StaffFamilyGridComponent;
  @ViewChild(StaffLicenseGridComponent) gridLicense!: StaffLicenseGridComponent;
  @ViewChild(StaffSchoolCareerGridComponent) gridSchoolcareer!: StaffSchoolCareerGridComponent;

  selectedStaff?: {companyCode: string, staffNo: string, staffName: string};

  drawerNewStaff: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerAppointment: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerDutyResponsibility: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerContact: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerFamily: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerSchoolCareer: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerLicense: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  constructor() {
    super();
  }

  ngOnInit() {
  }

  staffGridRowClicked(params: any) {
    console.log(params);
    this.selectedStaff = {companyCode: params.companyCode, staffNo: params.staffNo, staffName: params.name};
    this.formStaff.get(params.staffNo);
  }

  selectGridStaff() {
    this.drawerNewStaff.visible = false;

    this.gridStaff.getList();
  }

  newStaff() {
    this.drawerNewStaff.visible = true;
  }

  newAppoint() {
    this.drawerAppointment.visible = true;
  }

  newDutyResponsibility() {
    this.drawerDutyResponsibility.visible = true;
  }

  newContact() {
    this.drawerContact.visible = true;
  }

  selectGridAppointment() {
    this.drawerAppointment.visible = false;
    this.gridAppointment.getList(this.selectedStaff?.staffNo!);
    this.staffDesc.get(this.selectedStaff?.staffNo!);
  }

  editAppointment(row: StaffAppointmentRecord) {
    this.drawerAppointment.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawerAppointment.visible = true;
  }

  selectGridFaimly() {
    this.drawerFamily.visible = false;
    this.gridFamily.getList(this.selectedStaff?.staffNo!);
  }

  newFamily() {
    this.drawerFamily.visible = true;
  }

  editFamily(row: StaffFamily) {
    this.drawerFamily.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawerFamily.visible = true;
  }

  selectGridSchoolCareer() {
    this.drawerSchoolCareer.visible = false;
    this.gridSchoolcareer.getList(this.selectedStaff?.staffNo!);
  }

  newSchoolCareer() {
    this.drawerSchoolCareer.visible = true;
  }

  editSchoolCareer(row: StaffSchoolCareer) {
    this.drawerSchoolCareer.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawerSchoolCareer.visible = true;
  }

  selectGridLicense() {
    this.drawerLicense.visible = false;
    this.gridLicense.getList(this.selectedStaff?.staffNo!);
  }

  newLicense() {
    this.drawerLicense.visible = true;
  }

  editLicense(row: StaffLicense) {
    this.drawerLicense.initLoadId = {staffId: row.staffNo, seq: row.seq};
    this.drawerLicense.visible = true;
  }

}
