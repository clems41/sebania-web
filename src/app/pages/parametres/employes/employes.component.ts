import {Component, OnInit} from '@angular/core';
import {Ferme} from '../../../models/ferme';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FermeService} from '../../../services/ferme.service';
import {EmployeRequest} from '../../../models/ferme/employe-request';
import {ConfirmationService, MessageService} from 'primeng/api';
import {User} from '../../../models/user';
import { CardModule} from 'primeng/card';
import {NgForOf} from '@angular/common';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-employes',
  imports: [
    CardModule,
    NgForOf,
    Button,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    ScrollPanelModule,
    ConfirmDialogModule
  ],
  templateUrl: './employes.component.html',
  styleUrl: './employes.component.css'
})
export class EmployesComponent implements OnInit {
  employeForm: FormGroup;
  loading: boolean = false;
  employes: User[] = [];

  constructor(private formBuilder: FormBuilder, private fermeService: FermeService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.employeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.updateFerme();
  }

  updateFerme() {
    this.fermeService.getFerme().subscribe(
      (ferme: Ferme) => {
        this.employes = ferme.employes;
      }
    )
  }

  onDeleteEmploye(event: any, employe: User) {
    this.loading = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Êtes vous sûr de vouloir supprimer l'employé '${employe.first_name} ${employe.last_name}' ?`,
      header: 'Suppression',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger',
      },
      accept: () => {
        this.fermeService.deleteEmploye(employe.id).subscribe(
          {
            next: () => {
              this.updateFerme();
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `L'employé '${employe.first_name} ${employe.last_name}' a bien été supprimé.`
              });
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            }
          });
      }
    });
  }

  onSubmit() {
    if (this.employeForm.invalid) {
      return;
    }
    const email = this.employeForm.get('email')?.value;
    const first_name = this.employeForm.get('first_name')?.value;
    const last_name = this.employeForm.get('last_name')?.value;
    const request: EmployeRequest = {
      email: email,
      first_name: first_name,
      last_name: last_name,
    }
    this.loading = true;
    this.fermeService.addEmploye(request).subscribe(
      {
        next: (ferme: Ferme) => {
          this.employeForm.reset();
          this.employes = ferme.employes;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Le nouvel employé ${first_name} a bien été ajouté.`
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}
