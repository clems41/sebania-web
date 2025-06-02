// services/auth.service.ts
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from './http.service';
import {AccessResponse} from '../models/auth/access-response.interface';
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

  logout() {
    this.httpService.put(`${this.authPrefix}/logout/`, null, true, 0).subscribe();
    this.cacheService.removeTokens();
    this.router.navigate(['/connexion']);
  }

  login(email: string, password: string) {
    const request = {
      email: email,
      password: password,
    };
    this.httpService.post<AccessResponse>(`${this.authPrefix}/token/access/`, request, false, 0)
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
    return this.httpService.get<User>(`${this.authPrefix}/me`);
  }

  isLoggedIn(): boolean {
    return this.cacheService.getAccessToken() !== null;
  }
}
