import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmRoutingModule } from './hrm-routing.module';
import { StaffModule } from './staff/staff.module';
import { DeptService } from '../system/dept/dept.service';

@NgModule({
  imports: [
    CommonModule,
    HrmRoutingModule,
    StaffModule
  ],
  declarations: [],
  providers: [
    DeptService
  ]
})
export class HrmModule { }


