import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CooperationRoutingModule } from './cooperation-routing.module';

import { TeamModule } from './team/team.module';

@NgModule({
  imports: [
    CommonModule,
    CooperationRoutingModule,
    TeamModule
  ]
})
export class CooperationModule { }
