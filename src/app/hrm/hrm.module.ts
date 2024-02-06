import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmRoutingModule } from './hrm-routing.module';
import { DeptService } from '../system/dept/dept.service';

@NgModule({
  imports: [
    CommonModule,
    HrmRoutingModule
  ],
  declarations: [],
  providers: [
    DeptService
  ]
})
export class HrmModule { }


