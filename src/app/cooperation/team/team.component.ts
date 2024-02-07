import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { TeamGridComponent } from './team-grid.component';
import { TeamModel } from './team.model';
import { TeamService } from './team.service';
import { Team } from '../communication/model/team';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPageHeaderCustomComponent } from 'src/app/shared-component/nz-page-header-custom/nz-page-header-custom.component';
import { TeamFormComponent } from './team-form.component';


@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzDrawerModule,
    NzDividerModule,

    TeamFormComponent,
    TeamGridComponent,
    NzPageHeaderCustomComponent
  ],
  template: `
<app-nz-page-header-custom title="팀 정보" subtitle="팀 정보 관리"></app-nz-page-header-custom>

<div nz-row class="btn-group">
  <button nz-button (click)="getGridList('d')">
    <span nz-icon nzType="search"></span>조회
  </button>

  <nz-divider nzType="vertical"></nz-divider>

  <button nz-button (click)="newTeam()">
    <span nz-icon nzType="form"></span>팀등록
  </button>
</div>

<div style="height:300px">
  <app-team-grid [list]="gridList"
    (editButtonClicked)="editTeam($event)"
    (rowDoubleClicked)="editTeam($event)">
  </app-team-grid>
</div>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="800"
    [nzVisible]="drawerTeamForm.visible"
    nzTitle="코드분류 등록"
    (nzOnClose)="drawerTeamForm.visible = false">

    <app-team-form *nzDrawerContent
      [initLoadId]="drawerTeamForm.initLoadId"
      (formSaved)="getGridList('d')"
      (formDeleted)="getGridList('d')"
      (formClosed)="drawerTeamForm.visible = false">
    </app-team-form>
    <!--
    <app-hrm-code-type-form #formHrmType *nzDrawerContent
      [initLoadId]="drawerCodeType.initLoadId"
      (formSaved)="getGridHrmCodeType()"
      (formDeleted)="getGridHrmCodeType()"
      (formClosed)="drawerCodeType.visible = false">
    </app-hrm-code-type-form>
    -->
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

  `
})
export class TeamComponent implements OnInit {

  @ViewChild(TeamGridComponent) grid!: TeamGridComponent;

  drawerTeamForm: { visible: boolean, initLoadId: number | null } = {
    visible: false,
    initLoadId: null
  }

  gridList: TeamModel[] = [];

  private appAlarmService = inject(AppAlarmService);
  private service = inject(TeamService);

  ngOnInit() {
    this.getGridList('');
  }

  newTeam() {
    this.drawerTeamForm.initLoadId = null;
    this.drawerTeamForm.visible = true;
  }

  editTeam(team: Team) {
    this.drawerTeamForm.initLoadId = team.teamId;
    this.drawerTeamForm.visible = true;
  }

  getGridList(typeId: string): void {
    this.drawerTeamForm.visible = false;

    const params = {
    //  typeId : typeId
    };

    this.service
        .getList(params)
        .subscribe(
          (model: ResponseList<TeamModel>) => {
            if (model.total > 0) {
              this.gridList = model.data;
            } else {
              this.gridList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

}
