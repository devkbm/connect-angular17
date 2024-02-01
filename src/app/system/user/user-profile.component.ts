import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemUserProfile, UserSessionService } from 'src/app/core/service/user-session.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule, NzAvatarModule, NzIconModule, NzCardModule
  ],
  template: `
    <div class="card">
      <!--
      <nz-avatar
        [nzSrc]="profilePictureSrc"
        nzIcon="user"
        [nzSize]='48'>
      </nz-avatar>
      {{user?.staffName}}
-->
      <nz-card [nzBordered]="false">
        <nz-card-meta
          [nzAvatar]="avatarTemplate"
          [nzTitle]="titleTemplate"
          [nzDescription]="descTemplate">
        </nz-card-meta>
      </nz-card>
      <ng-template #avatarTemplate>
        <nz-avatar class="avatar" [nzShape]="'square'" [nzSize]='48' [nzSrc]="profilePictureSrc"></nz-avatar>
      </ng-template>

      <ng-template #titleTemplate>
        {{profile?.staffName + '(' + profile?.userId + ')'}}
      </ng-template>

      <ng-template #descTemplate>
        {{profile?.deptName}}
      </ng-template>
    </div>
  `,
  styles: [`
    .card {
      width: 200px;
      height: 100px;
      background-color: green;
      border: 1px solid rgb(232, 232, 232);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .card:hover {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
  `]
})
export class UserProfileComponent implements OnInit {

  profilePictureSrc: any;
  profile?: SystemUserProfile;

  private sessionService = inject(UserSessionService);

  ngOnInit() {
    this.profilePictureSrc = this.sessionService.getAvartarImageString();
    this.getMyInfo();
  }

  getMyInfo(): void {
    this.sessionService
        .getMyProfile()
        .subscribe(
            (model: ResponseObject<SystemUserProfile>) => {
              if ( model.total > 0 ) {
                this.profile = model.data;
              }
            }
        );
  }
}
