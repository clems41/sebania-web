import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connexion',
  imports: [
    FormsModule
  ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  constructor(private authService: AuthService, private router: Router) {}

  email: string = '';
  password: string = '';

  onSubmit() {
    this.authService.login(this.email, this.password);
  }

  toInscription() {
    this.router.navigate(['/inscription']);
  }

}
