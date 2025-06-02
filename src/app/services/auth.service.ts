import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {AccessResponse} from '../models/auth/access-response';
import {CacheService} from './cache.service';
import {Observable} from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authPrefix = '/auth';


  constructor(private router: Router, private httpService: HttpService, private cacheService: CacheService,
              private activatedRoute: ActivatedRoute) {
  }

  isLoggedIn(): boolean {
    return this.cacheService.getAccessToken() !== null;
  }

  logout() {
    this.httpService.logout(true);
  }

  login(email: string, password: string) {
    this.httpService.login(email, password)
      .subscribe(
        (response: AccessResponse) => {
          this.cacheService.storeAccessToken(response.access);
          this.cacheService.storeRefreshToken(response.refresh);
          const returnUrl = this.activatedRoute.snapshot.queryParams["returnUrl"] || '';
          this.router.navigate([returnUrl]);
        }
      );
  }

  me(): Observable<User> {
    return this.httpService.get<User>(`${this.authPrefix}/me/`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<null> {
    const request = {
      old_password: oldPassword,
      new_password: newPassword,
    }
    return this.httpService.put(`${this.authPrefix}/change-password/`, request);
  }
}
