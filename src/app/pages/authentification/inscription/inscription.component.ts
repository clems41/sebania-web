import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatLabel} from 'primeng/floatlabel';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {RegisterRequest} from '../../../models/auth/register-request';
import {Password} from 'primeng/password';
import {MessageService} from 'primeng/api';
import {ConfigurationService} from '../../../services/configuration.service';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {MultiSelectModule} from 'primeng/multiselect';
import {MethodeAgricole} from '../../../models/methode-agricole';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-inscription',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    NgOptimizedImage,
    Password,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    ButtonModule,
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  registerForm: FormGroup;
  loading: boolean = false;
  methodesAgricoles: MethodeAgricole[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService,
              private messageService: MessageService, private configurationService: ConfigurationService) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      ferme_nom: ['', [Validators.required]],
      ferme_code_postal: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      ferme_superficie_cultivee: [null, []],
      ferme_methodes_agricoles: [[], []],
    });
  }

  ngOnInit(): void {
    this.configurationService.getMethodesAgricoles().subscribe((methodesAgricoles) => {
        this.methodesAgricoles = methodesAgricoles;
      },
    )
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
    const first_name = this.registerForm.get('first_name')?.value;
    const last_name = this.registerForm.get('last_name')?.value;
    const ferme_nom = this.registerForm.get('ferme_nom')?.value;
    const ferme_code_postal = this.registerForm.get('ferme_code_postal')?.value;
    const ferme_superficie_cultivee = this.registerForm.get('ferme_superficie_cultivee')?.value;
    const ferme_methodes_agricoles = this.registerForm.get('ferme_methodes_agricoles')?.value;

    const query: RegisterRequest = {
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
      ferme: {
        nom: ferme_nom,
        superficie_cultivee: ferme_superficie_cultivee,
        code_postal: ferme_code_postal,
        methodes_agricoles: ferme_methodes_agricoles,
        employes: [],
      }
    }
    this.loading = true;
    this.authService.register(query).subscribe(
      {
        next: () => {
          this.authService.login(email, password).subscribe(
            {
              next: () => {
                this.loading = false;
                this.router.navigate(['/']);
              }
            }
          );
        },
        error: () => {
          this.loading = false;
        },
      }
    )
  }

}
