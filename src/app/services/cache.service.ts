import { Injectable } from '@angular/core';
import {ErrorCode} from '@angular/compiler-cli';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private errorCodesKey = 'error_codes';

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

  storeErrorCodes(errorCodes: ErrorCode[]) {
    this.store(this.errorCodesKey, errorCodes);
  }

  getErrorCodes() {
    return this.retrieve(this.errorCodesKey);
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
