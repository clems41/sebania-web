import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = environment.apiUrl;
  private defaultNumberOfRetries = 1; // Nombre de tentatives de réessai

  constructor(private http: HttpClient, private router: Router, private cacheService: CacheService) {
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur HTTP:', error);
    // Si on reçoit une 401, on veut rediriger vers la page de connexion
    if (error.status === 401) {
      // Redirige vers la page de connexion
      this.router.navigate(['/connexion'], {
        queryParams: {returnUrl: this.router.url}
      });
    }

    return throwError(() => error);
  }

  get<T>(path: string, params?: HttpParams, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const options = {
      headers: this.getHeaders(needAuth),
      params: params
    };

    return this.http
      .get<T>(`${this.apiUrl}v1${path}`, options)
      .pipe(
        retry(numberOfRetries), // Réessaie l'appel en cas d'échec
        catchError(error => this.handleError(error))
      );
  }

  post<T>(path: string, body: any | null, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const options = {
      headers: this.getHeaders(needAuth),
    };

    return this.http
      .post<T>(`${this.apiUrl}v1${path}`, body, options)
      .pipe(
        retry(numberOfRetries), // Réessaie l'appel en cas d'échec
        catchError(error => this.handleError(error))
      );
  }

  put<T>(path: string, body: any | null, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const options = {
      headers: this.getHeaders(needAuth)
    };

    return this.http
      .put<T>(`${this.apiUrl}v1${path}`, body, options)
      .pipe(
        retry(numberOfRetries), // Réessaie l'appel en cas d'échec
        catchError(error => this.handleError(error))
      );
  }

  delete<T>(path: string, needAuth: boolean = true, numberOfRetries: number = this.defaultNumberOfRetries): Observable<T> {
    const options = {
      headers: this.getHeaders(needAuth)
    };

    return this.http
      .delete<T>(`${this.apiUrl}v1${path}`, options)
      .pipe(
        retry(numberOfRetries), // Réessaie l'appel en cas d'échec
        catchError(error => this.handleError(error))
      );
  }
}
