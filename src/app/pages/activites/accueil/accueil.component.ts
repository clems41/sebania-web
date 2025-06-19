import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/user';
import {Tache} from '../../../models/tache';
import {TacheService} from '../../../services/tache.service';
import {TacheUtils} from '../../../utils/tache-utils';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {FermeService} from '../../../services/ferme.service';
import {UserUtils} from '../../../utils/user-utils';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {NgClass, NgIf} from '@angular/common';
import {DatePickerModule} from 'primeng/datepicker';
import {VocalService} from '../../../services/vocal.service';
import {Subscription, timer} from 'rxjs';
import {NiveauComplexite} from '../../../models/niveau-complexite';
import moment from 'moment';
import {DateUtils} from '../../../utils/date-utils';
import {StatutJour} from '../../../models/statut-jour';
import {ConfirmationService, Footer, MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ModificationTacheComponent} from './modification-tache/modification-tache.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [
    ScrollPanelModule,
    Select,
    FormsModule,
    FloatLabel,
    NgIf,
    DatePickerModule,
    NgClass,
    Button,
    ConfirmDialogModule
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  availableUsers: User[] = [];
  taches: Tache[] = [];
  date: Date = new Date();
  totalMinutes: number = 0;
  statutJour: StatutJour = StatutJour.ok;
  nbVocalInProgress: number = 0;
  refreshVocauxSub: Subscription = new Subscription();
  refreshVocauxDelaySeconds: number = 60;
  dynamicDialogRef: DynamicDialogRef | undefined;

  constructor(private authService: AuthService, private tacheService: TacheService,
              protected tacheUtils: TacheUtils, private fermeService: FermeService,
              private userUtils: UserUtils, private vocalService: VocalService,
              protected dateUtils: DateUtils, private messageService: MessageService,
              private confirmationService: ConfirmationService, private dialogService: DialogService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.refreshVocauxSub.unsubscribe();
    if (this.dynamicDialogRef) {
      this.dynamicDialogRef.close();
    }
  }

  showDialog(tache: Tache, field: string, cultureTacheIndex: number | null = null) {
    this.dynamicDialogRef = this.dialogService.open(ModificationTacheComponent, {
      inputValues: {
        tache: tache,
        field: field,
        cultureTacheIndex
      },
      header: `Modification de la tâche : '${tache.activite.nom}'`,
      width: '40%',
      modal: true,
      contentStyle: {overflow: 'auto'},
      closable: true,
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      templates: {
        footer: Footer
      }
    });

    this.dynamicDialogRef.onClose.subscribe((need_refresh: boolean) => {
      if (need_refresh) {
        this.loadTaches();
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(val => {
      const date = val['date'];
      if (date) {
        this.date = this.dateUtils.fromFrenchFormat(val['date']);
      }
    });
    this.authService.me().subscribe(user => {
      this.currentUser = user;
      this.loadTaches();
      this.refreshVocauxSub = timer(0, 1000 * this.refreshVocauxDelaySeconds).subscribe(() => {
        this.loadVocaux();
      });
      this.availableUsers = [user];
      if (this.userUtils.isResponsable(user)) {
        this.fermeService.getFerme().subscribe(ferme => {
          this.availableUsers.push(...ferme.employes);
        });
      }
    })
  }

  loadVocaux() {
    this.vocalService.getInProgressForTache(this.date).subscribe(
      (vocaux) => {
        this.nbVocalInProgress = vocaux.length;
      }
    )
  }

  loadTaches() {
    if (!this.currentUser) {
      return;
    }
    this.tacheService.getAll(this.currentUser.id, this.date).subscribe(
      (taches) => {
        this.taches = taches;
      }
    );
    this.tacheService.getTotalMinutesDay(this.currentUser.id, this.date).subscribe(
      (totalMinutes) => {
        this.totalMinutes = totalMinutes;
        this.statutJour = this.tacheUtils.getStatutJourFromTotalMinutes(totalMinutes);
      }
    );
  }

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
              this.loadTaches();
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

  onAddOneDay() {
    this.date = this.dateUtils.addDays(this.date, 1);
    this.loadTaches();
    this.loadVocaux();
  }

  onMinusOneDay() {
    this.date = this.dateUtils.addDays(this.date, -1);
    this.loadTaches();
    this.loadVocaux();
  }

  protected readonly NiveauComplexite = NiveauComplexite;
  protected readonly moment = moment;
  protected readonly StatutJour = StatutJour;
}
