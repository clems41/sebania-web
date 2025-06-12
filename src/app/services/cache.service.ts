import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor() { }

  removeTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  storeAccessToken(token: string) {
    this.store(this.accessTokenKey, token);
  }

  storeRefreshToken(token: string) {
    this.store(this.refreshTokenKey, token);
  }

  getAccessToken() {
    return this.retrieve(this.accessTokenKey);
  }

  getRefreshToken() {
    return this.retrieve(this.refreshTokenKey);
  }

  private store(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private retrieve(key: string) {
    return JSON.parse(<string>localStorage.getItem(key));
  }
}
