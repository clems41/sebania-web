import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, filter, finalize, Observable, of, switchMap, take, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {CacheService} from './cache.service';
import {AccessResponse} from '../models/auth/access-response.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = environment.apiUrl;
  private defaultNumberOfRetries = 0; // Nombre de tentatives de réessai
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private authPrefix = '/auth';

  constructor(private http: HttpClient, private router: Router, private cacheService: CacheService) {
  }

  refreshToken(): Observable<string> {
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1)
      );
    }

    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = this.cacheService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      throwError(() => new Error('No refresh token found'));
    }

    return this.post<AccessResponse>(
      `${this.authPrefix}/token/refresh/`,
      {refresh: refreshToken},
    ).pipe(
      switchMap((response: AccessResponse) => {
        this.cacheService.storeAccessToken(response.access);
        this.refreshTokenSubject.next(response.access);
        return of(response.access);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        this.refreshTokenInProgress = false;
      })
    );
  }

  login(email: string, password: string) {
    const request = {
      email: email,
      password: password,
    };
    return this.post<AccessResponse>(`${this.authPrefix}/token/access/`, request)
  }


  logout(callApi: boolean = false) {
    if (callApi) {
      this.put(`${this.authPrefix}/logout/`, null, true, 0).subscribe();
    }
    this.cacheService.removeTokens();
    // Redirige vers la page de connexion
    this.router.navigate(['/auth/connexion'], {
      queryParams: {returnUrl: this.router.url}
    });
  }

  get<T>(path: string, params?: HttpParams, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const makeRequest = () => {
      const options = {
        headers: this.getHeaders(needAuth),
        params: params
      };
      return this.http.get<T>(`${this.apiUrl}v1${path}`, options);
    };

    return makeRequest().pipe(
      retry(numberOfRetries),
      catchError(error => this.handleError(error, () => makeRequest()))
    );
  }

  post<T>(path: string, body: any | null, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const makeRequest = () => {
      const options = {
        headers: this.getHeaders(needAuth)
      };
      return this.http.post<T>(`${this.apiUrl}v1${path}`, body, options);
    };

    return makeRequest().pipe(
      retry(numberOfRetries),
      catchError(error => this.handleError(error, () => makeRequest()))
    );
  }

  put<T>(path: string, body: any | null, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const makeRequest = () => {
      const options = {
        headers: this.getHeaders(needAuth)
      };
      return this.http.put<T>(`${this.apiUrl}v1${path}`, body, options);
    };

    return makeRequest().pipe(
      retry(numberOfRetries),
      catchError(error => this.handleError(error, () => makeRequest()))
    );
  }

  delete<T>(path: string, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const makeRequest = () => {
      const options = {
        headers: this.getHeaders(needAuth)
      };
      return this.http.delete<T>(`${this.apiUrl}v1${path}`, options);
    };

    return makeRequest().pipe(
      retry(numberOfRetries),
      catchError(error => this.handleError(error, () => makeRequest()))
    );
  }

  private getHeaders(needAuth: boolean) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (needAuth) {
      headers = headers.append('Authorization', `Bearer ${this.cacheService.getAccessToken()}`);
    }
    return headers;
  }

  private handleError(error: HttpErrorResponse, retryCallback: () => Observable<any>): Observable<any> {
    if (error.status === 401) {
      return this.refreshToken().pipe(
        switchMap(() => {
          // Réessayer la requête originale avec le nouveau token
          return retryCallback();
        }),
        catchError(refreshError => {
          // Si le refresh échoue, déconnexion
          this.logout();
          return throwError(() => refreshError);
        })
      );
    }
    return throwError(() => error);
  }


}
