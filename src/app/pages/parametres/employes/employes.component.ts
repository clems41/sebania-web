import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ferme} from '../../../models/ferme';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FermeService} from '../../../services/ferme.service';
import {ConfirmationService, Footer, MessageService} from 'primeng/api';
import {User} from '../../../models/user';
import { CardModule} from 'primeng/card';
import {Button} from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TableModule} from 'primeng/table';
import {EmployeDialogComponent} from './employe-dialog/employe-dialog.component';

@Component({
  selector: 'app-employes',
  imports: [
    TableModule,
    CardModule,
    Button,
    ReactiveFormsModule,
    ScrollPanelModule,
    ConfirmDialogModule,
  ],
  templateUrl: './employes.component.html',
  styleUrl: './employes.component.css'
})
export class EmployesComponent implements OnInit, OnDestroy {
  employeForm: FormGroup;
  loading: boolean = false;
  employes: User[] = [];

  ref: DynamicDialogRef | undefined;

  constructor(private formBuilder: FormBuilder, private fermeService: FermeService,
              private messageService: MessageService, private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
    this.employeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.updateFerme();
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  updateFerme() {
    this.fermeService.getFerme().subscribe(
      (ferme: Ferme) => {
        this.employes = ferme.employes;
      }
    )
  }

  showDialog() {
    this.ref = this.dialogService.open(EmployeDialogComponent, {
      header: "Ajout d'un nouvel employé",
      width: 'full',
      modal: true,
      contentStyle: {overflow: 'auto'},
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      templates: {
        footer: Footer
      }
    });

    this.ref.onClose.subscribe((need_refresh: boolean) => {
      if (need_refresh) {
        this.updateFerme();
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}`});
    });
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

}
