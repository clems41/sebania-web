import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {NiveauComplexite} from '../../../../models/niveau-complexite';
import {Parcelle} from '../../../../models/parcelle';
import {Tache} from '../../../../models/tache';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {TacheService} from '../../../../services/tache.service';
import {NgClass} from '@angular/common';
import {TacheUtils} from '../../../../utils/tache-utils';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-card-activite',
  imports: [
    Button,
    Tooltip,
    NgClass,
    ConfirmDialogModule
  ],
  templateUrl: './card-activite.component.html',
  styleUrl: './card-activite.component.css'
})
export class CardActiviteComponent {
  @Input() tache: any;
  @Input() isMobile: boolean = false;
  @Output() onDeleteEvent: EventEmitter<number> = new EventEmitter();


  constructor(private confirmationService: ConfirmationService, private router: Router,
              private tacheService: TacheService, private messageService: MessageService,
              protected tacheUtils: TacheUtils) {
  }

  protected readonly NiveauComplexite = NiveauComplexite;

  onDelete(event: any, tache: Tache) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Êtes vous sûr de vouloir supprimer la tâche '${tache.activite.nom}' ?`,
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
        this.tacheService.delete(tache.id).subscribe(
          {
            next: () => {
              this.onDeleteEvent.next(tache.id);
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `La tâche '${tache.activite.nom}' a bien été suprimée.`
              });
            }
          }
        );
      }
    });
  }

  getParcelleNoms(parcelles: Parcelle[]) {
    if (parcelles && parcelles.length > 0) {
      return parcelles.map(parcelle => parcelle.nom).join(", ")
    }
    return null;
  }

  navigateToSaisie(tache_id: number) {
    this.router.navigate(['/activites/saisie'], {
      queryParams: {
        tache_id: tache_id
      }
    });
  }
}
