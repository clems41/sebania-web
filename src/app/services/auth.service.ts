import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AccessResponse} from '../models/auth/access-response';
import {CacheService} from './cache.service';
import {map, Observable} from 'rxjs';
import {User} from '../models/user';
import {HttpParams} from '@angular/common/http';
import {RegisterRequest} from '../models/auth/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authPrefix = '/auth';


  constructor(private httpService: HttpService, private cacheService: CacheService) {
  }

  isLoggedIn(): boolean {
    return this.cacheService.getAccessToken() !== null;
  }

  logout() {
    this.cacheService.removeCurentUser();
    this.httpService.logout(true);
  }

  login(email: string, password: string): Observable<AccessResponse> {
    return this.httpService.login(email, password)
      .pipe(
        map((response: AccessResponse) => {
          this.cacheService.storeAccessToken(response.access);
          this.cacheService.storeRefreshToken(response.refresh);
          this.me().subscribe(
            user => this.cacheService.storeCurentUser(user)
          );
          return response;
        })
      );
  }

  resetPassword(email: string): Observable<null> {
    const params: HttpParams = new HttpParams().set('email', email);
    return this.httpService.get(`${this.authPrefix}/reset-password/`, {params: params});
  }

  me(): Observable<User> {
    return this.httpService.get<User>(`${this.authPrefix}/me/`);
  }

  register(request: RegisterRequest): Observable<User> {
    return this.httpService.post(`${this.authPrefix}/register/`, request);
  }

  emailExists(email: string): Observable<boolean> {
    const params: HttpParams = new HttpParams().set('email', email);
    return this.httpService.get<boolean>(`${this.authPrefix}/email/`, {params: params});
  }

  changePassword(oldPassword: string, newPassword: string): Observable<null> {
    const request = {
      old_password: oldPassword,
      new_password: newPassword,
    }
    return this.httpService.put(`${this.authPrefix}/change-password/`, request);
  }
}
