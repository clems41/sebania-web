import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, filter, finalize, Observable, of, switchMap, take, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {CacheService} from './cache.service';
import {AccessResponse} from '../models/auth/access-response';
import {MessageService} from 'primeng/api';
import {ErrorResponse} from '../models/errors/error-response';
import {ErrorCodes} from '../models/errors/error-code';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = environment.apiUrl;
  private defaultNumberOfRetries = 0; // Nombre de tentatives de réessai
  private defaultNeedAuth: boolean = true;
  private defaultHandleError: boolean = true;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private authPrefix = '/auth';

  constructor(private http: HttpClient, private router: Router, private cacheService: CacheService,
              private messageService: MessageService) {
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
      {refresh: refreshToken}, {handleError: false, needAuth: false},
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
    const options = {
      handleError: false,
      needAuth: false,
    };
    return this.post<AccessResponse>(`${this.authPrefix}/token/access/`, request, options);
  }


  logout(callApi: boolean = false) {
    if (callApi) {
      const options = {
        handleError: false,
      };
      this.put(`${this.authPrefix}/logout/`, null, options).subscribe();
    }
    this.cacheService.removeTokens();
    // Redirige vers la page de connexion
    this.router.navigate(['/auth/connexion'], {
      queryParams: {returnUrl: this.router.url}
    });
  }

  get<T>(path: string, options?: {params?: HttpParams, handleError?: boolean, needAuth?: boolean, numberOfRetries?: number}): Observable<T> {
    const makeRequest = () => {
      const requestOptions = {
        headers: this.getHeaders(options?.needAuth ?? this.defaultNeedAuth),
        params: options?.params,
      };
      return this.http.get<T>(`${this.apiUrl}v1${path}`, requestOptions);
    };

    if (!(options?.handleError ?? this.defaultHandleError)) {
      return makeRequest();
    }

    return makeRequest().pipe(
      retry(options?.numberOfRetries ?? this.defaultNumberOfRetries),
      catchError(error => this.handleError(error, () => makeRequest()))
    );
  }

  post<T>(path: string, body: any | null, options?: {handleError?: boolean, needAuth?: boolean, numberOfRetries?: number}): Observable<T> {
    const makeRequest = () => {
      const requestOptions = {
        headers: this.getHeaders(options?.needAuth ?? this.defaultNeedAuth),
      };
      return this.http.post<T>(`${this.apiUrl}v1${path}`, body, requestOptions);
    };

    if (!(options?.handleError ?? this.defaultHandleError)) {
      return makeRequest();
    }

    return makeRequest().pipe(
      retry(options?.numberOfRetries ?? this.defaultNumberOfRetries),
      catchError(error => this.handleError(error, () => makeRequest()))
    );
  }

  put<T>(path: string, body: any | null, options?: {handleError?: boolean, needAuth?: boolean, numberOfRetries?: number}): Observable<T> {
    const makeRequest = () => {
      const requestOptions = {
        headers: this.getHeaders(options?.needAuth ?? this.defaultNeedAuth),
      };
      return this.http.put<T>(`${this.apiUrl}v1${path}`, body, requestOptions);
    };

    if (!(options?.handleError ?? this.defaultHandleError)) {
      return makeRequest();
    }

    return makeRequest().pipe(
      retry(options?.numberOfRetries ?? this.defaultNumberOfRetries),
      catchError(error => this.handleError(error, () => makeRequest()))
    );
  }

  delete<T>(path: string, options?: {handleError?: boolean, needAuth?: boolean, numberOfRetries?: number}): Observable<T> {
    const makeRequest = () => {
      const requestOptions = {
        headers: this.getHeaders(options?.needAuth ?? this.defaultNeedAuth),
      };
      return this.http.delete<T>(`${this.apiUrl}v1${path}`, requestOptions);
    };

    if (!(options?.handleError ?? this.defaultHandleError)) {
      return makeRequest();
    }

    return makeRequest().pipe(
      retry(options?.numberOfRetries ?? this.defaultNumberOfRetries),
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
    } else {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: this.getErrorMessage(error), closable: true});
    }
    return throwError(() => error);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const errorResponse = error.error as ErrorResponse;
    if (errorResponse) {
      return ErrorCodes[errorResponse.code] || ErrorCodes['DEFAULT'];
    }
    return ErrorCodes['DEFAULT'];
  }


}
