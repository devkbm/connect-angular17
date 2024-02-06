import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AppBase } from 'src/app/core/app/app-base';
import { HrmCodeTypeGridComponent } from './hrm-code-type-grid.component';
import { HrmCodeGridComponent } from './hrm-code-grid.component';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { HrmCodeService } from './hrm-code.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { HrmCode } from './hrm-code.model';
import { HrmCodeTypeService } from './hrm-code-type.service';
import { HrmType } from './hrm-type.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { HrmTypeCodeFormComponent } from './hrm-code-form.component';
import { HrmCodeTypeFormComponent } from './hrm-code-type-form.component';

@Component({
  selector: 'app-hrm-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    /* NG-ZORRO */
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzDrawerModule,
    NzSelectModule,
    NzPageHeaderModule,
    NzInputModule,

    NzPageHeaderCustomComponent,
    HrmCodeGridComponent,
    HrmCodeTypeGridComponent,
    HrmTypeCodeFormComponent,
    HrmCodeTypeFormComponent
  ],
  template: `
<app-nz-page-header-custom title="인사시스템 코드 정보" subtitle="인사시스템 구분 코드 정보 관리"></app-nz-page-header-custom>

<div nz-row class="btn-group">

  <div nz-col [nzSpan]="24" class="text-right">
    <button nz-button (click)="newHrmCodeType()">
      <span nz-icon nzType="form"></span>코드분류등록
    </button>
    <nz-divider nzType="vertical"></nz-divider>

    <button nz-button (click)="newHrmCode()">
      <span nz-icon nzType="form"></span>코드등록
    </button>
    <nz-divider nzType="vertical"></nz-divider>

    <button nz-button (click)="getGridHrmCodeType()">
      <span nz-icon nzType="form"></span>조회
    </button>
  </div>
</div>

<div class="content">
    <h3 class="pgm-title">코드 분류 목록 {{drawerCodeType | json}}</h3>
    <app-hrm-code-type-grid #gridHrmType
      [list]="gridHrmCodeTypeList"
      (rowSelected)="rowClickHrmCodeType($event)"
      (rowDoubleClicked)="editHrmCodeType($event)"
      (editButtonClicked)="editHrmCodeType($event)">
    </app-hrm-code-type-grid>

    <h3 class="pgm-title">코드 목록 {{drawerCode | json}}</h3>
    <app-hrm-code-grid #gridHrmTypeCode
      [list]="gridHrmCodeList"
      (rowSelected)="rowClickHrmCode($event)"
      (rowDoubleClicked)="editHrmCode($event)"
      (editButtonClicked)="editHrmCode($event)">
    </app-hrm-code-grid>
</div>


<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="800"
    [nzVisible]="drawerCodeType.visible"
    nzTitle="코드분류 등록"
    (nzOnClose)="drawerCodeType.visible = false">
    <app-hrm-code-type-form #formHrmType *nzDrawerContent
      [initLoadId]="drawerCodeType.initLoadId"
      (formSaved)="getGridHrmCodeType()"
      (formDeleted)="getGridHrmCodeType()"
      (formClosed)="drawerCodeType.visible = false">
    </app-hrm-code-type-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="800"
    [nzVisible]="drawerCode.visible"
    nzTitle="코드 등록"
    (nzOnClose)="drawerCode.visible = false">

    <app-hrm-code-form #formHrmTypeCode *nzDrawerContent
      [initLoadId]="drawerCode.initLoadId"
      (formSaved)="getGridHrmCode()"
      (formDeleted)="getGridHrmCode()"
      (formClosed)="drawerCode.visible = false">
    </app-hrm-code-form>
</nz-drawer>
  `,
  styles: `
.pgm-title {
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

.content {
  height: calc(100% - 124px);
  display: grid;
  grid-template-rows: 34px 1fr 34px 1fr;
  grid-template-columns: 1fr;
}

.footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 10px 16px;
  text-align: right;
  left: 0px;
  /*background: #fff;*/
}

.text-right {
  text-align: right;
}

  `
})
export class HrmCodeComponent extends AppBase implements OnInit {

  @ViewChild(HrmCodeTypeGridComponent) gridHrmCodeType!: HrmCodeTypeGridComponent;
  @ViewChild(HrmCodeGridComponent) gridHrmCode!: HrmCodeGridComponent;

  gridHrmCodeTypeList: HrmType[] = [];
  gridHrmCodeList: HrmCode[] = [];

  drawerCodeType: { visible: boolean, initLoadId: any } = {
    visible: false,
    initLoadId: null
  }

  drawerCode: { visible: boolean, initLoadId: {typeId: any, code: any} | null } = {
    visible: false,
    initLoadId: null
  }

  private appAlarmService = inject(AppAlarmService);
  private hrmCodeService = inject(HrmCodeService);
  private hrmCodeTypeService = inject(HrmCodeTypeService);

  ngOnInit() {
    this.getGridHrmCodeType();
  }

  getGridHrmCodeType(): void {
    this.drawerCodeType.visible = false;
    this.getGridHrmCodeTypeList('');
  }

  rowClickHrmCodeType(row: any): void {
    this.drawerCodeType.initLoadId = row.typeId;
    this.drawerCode.initLoadId = {typeId: row.typeId, code: ''};

    this.gridHrmCodeGridList(row.typeId);
  }

  newHrmCodeType(): void {
    this.drawerCodeType.initLoadId = null;
    this.drawerCodeType.visible = true;
  }

  editHrmCodeType(row: any): void {
    this.drawerCodeType.initLoadId = row.typeId;
    this.drawerCodeType.visible = true;
  }

  rowClickHrmCode(row: any): void {
    this.drawerCode.initLoadId = {typeId: row.typeId, code: row.code};
  }

  getGridHrmCode(): void {
    this.drawerCode.visible = false;
    this.gridHrmCodeGridList(this.drawerCodeType.initLoadId);
  }

  newHrmCode(): void {
    this.drawerCode.initLoadId = {typeId: this.drawerCodeType.initLoadId, code: null};
    this.drawerCode.visible = true;
  }

  editHrmCode(row: any): void {
    this.drawerCode.initLoadId = {typeId: row.typeId, code: row.code};
    this.drawerCode.visible = true;
  }

  public gridHrmCodeGridList(typeId: string): void {
    const params = {
      typeId : typeId
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            if (model.total > 0) {
              this.gridHrmCodeList = model.data;
            } else {
              this.gridHrmCodeList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  getGridHrmCodeTypeList(hrmType: string): void {
    const params = {
      hrmType : hrmType
    };

    this.hrmCodeTypeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmType>) => {
            if (model.total > 0) {
              this.gridHrmCodeTypeList = model.data;
            } else {
              this.gridHrmCodeTypeList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

}
