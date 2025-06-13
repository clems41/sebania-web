import {Injectable} from '@angular/core';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserUtils {
  private responsableRole = 'RESPONSABLE';
  private employeRole = 'EMPLOYE';
  isResponsable(user: User): boolean {
    return user.roles.includes(this.responsableRole);
  }
  isEmploye(user: User): boolean {
    return user.roles.includes(this.employeRole);
  }
}
