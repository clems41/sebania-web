import {Component} from '@angular/core';
import {FloatLabel} from "primeng/floatlabel";
import {Password} from "primeng/password";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../../services/auth.service';
import {MessageService} from 'primeng/api';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-change-password',
  imports: [
    FloatLabel,
    Password,
    ReactiveFormsModule,
    Button
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
              private messageService: MessageService) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    this.loading = true;
    this.authService.changePassword(oldPassword, newPassword).subscribe(
      {
        next: () => {
          this.changePasswordForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: "Votre mot de passe a correctement été mis à jour."
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      }
    );
  }

}
