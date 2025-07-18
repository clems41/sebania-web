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
import moment from 'moment';
import {DateUtils} from '../../../utils/date-utils';
import {StatutJour} from '../../../models/statut-jour';
import {Button} from 'primeng/button';
import {ActivatedRoute, Router} from '@angular/router';
import {TooltipModule} from 'primeng/tooltip';
import {CardActiviteComponent} from './card-activite/card-activite.component';

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
    TooltipModule,
    CardActiviteComponent
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit, OnDestroy {
  currentUser: User | undefined = undefined;
  availableUsers: User[] = [];
  taches: Tache[] = [];
  date: Date = new Date();
  totalMinutes: number = 0;
  statutJour: StatutJour = StatutJour.ok;
  nbVocalInProgress: number = 0;
  refreshVocauxSub: Subscription = new Subscription();
  refreshVocauxDelaySeconds: number = 60;
  loading: boolean = false;

  constructor(private authService: AuthService, private tacheService: TacheService,
              protected tacheUtils: TacheUtils, private fermeService: FermeService,
              private userUtils: UserUtils, private vocalService: VocalService,
              protected dateUtils: DateUtils,
              private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnDestroy(): void {
    this.refreshVocauxSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.queryParams.subscribe(val => {
      const date = val['date'];
      const user_id = val['user_id'];
      if (date) {
        this.date = this.dateUtils.fromFrenchFormat(val['date']);
      }
      this.authService.me().subscribe(user => {
        this.currentUser = user;
        this.availableUsers = [user];
        if (this.userUtils.isResponsable(user)) {
          this.fermeService.getFerme().subscribe(ferme => {
            this.availableUsers.push(...ferme.employes);
            if (user_id) {
              this.currentUser = this.availableUsers.find(user => {
                return user.id == +user_id
              })
            }
            this.loadTaches();
          });
        } else {
          this.loadTaches();
        }
        this.refreshVocauxSub = timer(0, 1000 * this.refreshVocauxDelaySeconds).subscribe(() => {
          this.loadVocaux();
        });
      })
    });
  }

  onDeleteTache() {
    this.loadTaches();
  }

  loadVocaux() {
    this.vocalService.getInProgressForTache(this.date).subscribe(
      (vocaux) => {
        this.nbVocalInProgress = vocaux.length;
      }
    )
  }

  loadTaches() {
    this.loading = true;
    if (!this.currentUser) {
      return;
    }
    this.tacheService.getAll(this.currentUser.id, this.date).subscribe(
      (taches) => {
        this.taches = taches;
        this.loading = false;
      }
    );
    this.tacheService.getTotalMinutesDay(this.currentUser.id, this.date).subscribe(
      (totalMinutes) => {
        this.totalMinutes = totalMinutes;
        this.statutJour = this.tacheUtils.getStatutJourFromTotalMinutes(totalMinutes);
      }
    );
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

  navigateToSaisieForCurrentUserAndDate() {
    this.router.navigate(['/activites/saisie'], {
      queryParams: {
        date: this.dateUtils.toFrenchFormat(this.date),
        user_id: this.currentUser?.id,
      }
    });
  }

  protected readonly moment = moment;
  protected readonly StatutJour = StatutJour;
}
