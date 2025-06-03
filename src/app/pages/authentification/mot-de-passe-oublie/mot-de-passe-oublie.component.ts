import {Component} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-mot-de-passe-oublie',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FloatLabel,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './mot-de-passe-oublie.component.html',
  styleUrl: './mot-de-passe-oublie.component.css'
})
export class MotDePasseOublieComponent {
  resetForm: FormGroup;
  disableConnexionButton: boolean = true;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService,
              private router: Router) {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    const email = this.resetForm.get('email')?.value;
    this.resetForm.reset();
    this.loading = true;

    this.authService.resetPassword(email)
      .subscribe({
          next: () => {
            this.disableConnexionButton = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: "Votre mot de passe a été réinitialisé. Veuillez vérifier votre boîte mail."
            });
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        }
      );
  }

  toConnexion() {
    this.router.navigate(['/auth/connexion']);
  }

}
