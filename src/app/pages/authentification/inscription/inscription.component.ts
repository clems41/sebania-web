import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatLabel} from 'primeng/floatlabel';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {RegisterRequest} from '../../../models/auth/register-request';
import {Password} from 'primeng/password';

@Component({
  selector: 'app-inscription',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    NgIf,
    NgOptimizedImage,
    Password
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  registerForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toConnexion() {
    this.router.navigate(['/auth/connexion']);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const query: RegisterRequest = {
      email: email,
      password: password,
      first_name: '',
      last_name: '',
      ferme: {
        nom: '',
        adresse: '',
        superficie_cultivee: '',
        code_postal: '',
        methodes_agricoles: [],
        employes: [],
      }
    }
    this.loading = true;
    this.authService.register(query).subscribe(
      {
        next: () => {
          this.loading = false;
          this.authService.login(email, password);
        },
        error: () => {
          this.loading = false;
          this.registerForm.reset();
        },
      }
    )
  }

}
