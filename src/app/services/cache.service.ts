import { Injectable } from '@angular/core';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private currentUserKey = 'current_user';

  constructor() { }

  removeTokens() {
    this.remove(this.accessTokenKey);
    this.remove(this.refreshTokenKey);
  }

  storeAccessToken(token: string) {
    this.store(this.accessTokenKey, token);
  }

  storeRefreshToken(token: string) {
    this.store(this.refreshTokenKey, token);
  }

  getAccessToken(): string {
    return this.retrieve(this.accessTokenKey);
  }

  getRefreshToken(): string {
    return this.retrieve(this.refreshTokenKey);
  }

  storeCurentUser(user: User) {
    this.store(this.currentUserKey, user);
  }

  getCurentUser(): User {
    return this.retrieve(this.currentUserKey);
  }

  removeCurentUser() {
    this.remove(this.currentUserKey);
  }

  private store(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private remove(key: string) {
    localStorage.removeItem(key);
  }

  private retrieve(key: string) {
    return JSON.parse(<string>localStorage.getItem(key));
  }
}
