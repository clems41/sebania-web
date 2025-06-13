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
import {NgIf} from '@angular/common';
import {DatePickerModule} from 'primeng/datepicker';
import {VocalService} from '../../../services/vocal.service';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-accueil',
  imports: [
    ScrollPanelModule,
    Select,
    FormsModule,
    FloatLabel,
    NgIf,
    DatePickerModule
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
  nbVocalInProgress: number = 0;
  refreshVocauxSub: Subscription = new Subscription();
  refreshVocauxDelaySeconds: number = 60;

  constructor(private authService: AuthService, private tacheService: TacheService,
              protected tacheUtils: TacheUtils, private fermeService: FermeService,
              private userUtils: UserUtils, private vocalService: VocalService) {
  }

  ngOnDestroy(): void {
    this.refreshVocauxSub.unsubscribe();
  }

  ngOnInit(): void {
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
      }
    );
  }
}
