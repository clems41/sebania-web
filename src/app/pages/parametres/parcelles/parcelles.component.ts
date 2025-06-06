import {Component, OnDestroy, OnInit} from '@angular/core';
import {Parcelle} from '../../../models/parcelle';
import {ParcelleService} from '../../../services/parcelle.service';
import {ConfirmationService, Footer, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ParcelleDialogComponent} from './parcelle-dialog/parcelle-dialog.component';
import {Button} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-parcelles',
  imports: [
    TableModule,
    Button,
    ConfirmDialogModule,
    FormsModule,
    InputText,
    ReactiveFormsModule,
  ],
  templateUrl: './parcelles.component.html',
  styleUrl: './parcelles.component.css'
})
export class ParcellesComponent implements OnInit, OnDestroy {
  parcelles: Parcelle[] = [];
  filteredParcelles: Parcelle[] = [];

  ref: DynamicDialogRef | undefined;

  constructor(private parcelleService: ParcelleService, private messageService: MessageService,
              private dialogService: DialogService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.refreshParcelles(true);
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  showDialog(parcelle: Parcelle | null) {
    this.ref = this.dialogService.open(ParcelleDialogComponent, {
      inputValues: {
        parcelle: parcelle,
      },
      header: parcelle != null ? `Modification de la parcelle : ${parcelle.nom}` : "Ajout d'une nouvelle parcelle",
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
        this.refreshParcelles();
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}`});
    });
  }

  refreshParcelles(onInit: boolean = false) {
    this.parcelleService.getAll().subscribe(
      {
        next: (parcelles: Parcelle[]) => {
          this.parcelles = parcelles;
          this.sortParcelles();
          if (onInit) {
            this.filteredParcelles = this.parcelles;
          }
        },
      }
    )
  }

  sortParcelles() {
    this.parcelles = this.parcelles.sort((a, b) => {
      if (a.type.id == b.type.id) {
        return a.nom.localeCompare(b.nom);
      }
      return a.type.nom.localeCompare(b.type.nom);
    });
  }

  filterByNomParcelles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length == 0) {
      this.filteredParcelles = this.parcelles;
      return;
    }
    this.filteredParcelles = this.parcelles.filter(parcelle => parcelle.nom.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onDelete(event: Event, parcelle: Parcelle) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Êtes vous sûr de vouloir supprimer la parcelle ${parcelle.nom} ?`,
      header: 'Suppression',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
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
        this.deleteParcelle(parcelle);
      }
    });
  }

  deleteParcelle(parcelle: Parcelle) {
    this.parcelleService.delete(parcelle.id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `La parcelle ${parcelle.nom} a bien été supprimée.`
        });
        this.refreshParcelles();
      });
  }
}
