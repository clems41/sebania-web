import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorCodes} from '../../../models/errors/error-code';
import {MessageService} from 'primeng/api';
import {NgOptimizedImage} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {Password} from 'primeng/password';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-connexion',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    FloatLabel,
    RouterLink,
    Password,
    InputText,
    Button
  ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router,
              private activatedRoute: ActivatedRoute, private messageService: MessageService,
              private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(email, password)
      .subscribe(
        {
          next: () => {
            const returnUrl = this.activatedRoute.snapshot.queryParams["returnUrl"] || '';
            this.loading = false;
            this.router.navigate([returnUrl]);
          },
          error: (error: HttpErrorResponse) => {
            let message = ErrorCodes['DEFAULT'];
            if (error.status === 401) {
              message = ErrorCodes['AUTH_BAD_CREDENTIALS'];
            }
            this.messageService.add({severity: 'error', summary: 'Erreur', detail: message});
            this.loginForm.reset();
            this.loading = false;
          }
        }
      );
  }

  toInscription() {
    this.router.navigate(['/auth/inscription']);
  }

}
