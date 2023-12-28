import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { ResponseObject } from '../model/response-object';
import { User } from '../../system/user/user.model';
import { GlobalProperty } from 'src/app/core/global-property';


@Injectable({
  providedIn: 'root'
})
export class UserSessionService extends DataService {
  private IMAGE_URI = '/api/system/fileimage/';

  constructor() {
    super('/api/system/user');
    this.IMAGE_URI = GlobalProperty.serverUrl + '/api/system/fileimage/';
  }

  getAvartarImageString(): string | null {
    const imageUrl = sessionStorage.getItem('imageUrl');
    if (imageUrl === 'null') return null;

    return this.IMAGE_URI + sessionStorage.getItem('imageUrl');
  }

  getMyProfile(): Observable<ResponseObject<User>> {
    const url = `${this.API_URL}/my-profile`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<User>>(url, options).pipe(
        //catchError((err) => Observable.throw(err))
      );
  }
}
