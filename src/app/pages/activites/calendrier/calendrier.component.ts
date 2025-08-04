import {Component, OnInit} from '@angular/core';
import {FloatLabel} from "primeng/floatlabel";
import {NgIf} from "@angular/common";
import {Select} from "primeng/select";
import {FormsModule} from '@angular/forms';
import {User} from '../../../models/user';
import {AuthService} from '../../../services/auth.service';
import {UserUtils} from '../../../utils/user-utils';
import {FermeService} from '../../../services/ferme.service';
import {SemaineComponent} from './semaine/semaine.component';
import {MoisComponent} from './mois/mois.component';
import {Router} from '@angular/router';
import {DateUtils} from '../../../utils/date-utils';
import moment from 'moment';

@Component({
  selector: 'app-calendrier',
  imports: [
    FloatLabel,
    NgIf,
    Select,
    FormsModule,
    SemaineComponent,
    MoisComponent
  ],
  templateUrl: './calendrier.component.html',
  styleUrl: './calendrier.component.css'
})
export class CalendrierComponent implements OnInit {
  currentUser: User | undefined = undefined;
  availableUsers: User[] = [];
  calendrierSelectorSemaine: string = "Semaine";
  calendrierSelectorMois: string = "Mois";
  calendrierSelector: string = this.calendrierSelectorSemaine;

  constructor(private authService: AuthService, private userUtils: UserUtils,
              private fermeService: FermeService, private router: Router,
              private dateUtils: DateUtils) {
  }

  ngOnInit(): void {
    this.authService.me().subscribe(user => {
      this.currentUser = user;
      this.availableUsers = [user];
      if (this.userUtils.isResponsable(user)) {
        this.fermeService.getFerme().subscribe(ferme => {
          this.availableUsers.push(...ferme.employes);
        });
      }
    })
  }

  navigateToSaisieForCurrentUserAndDate(date: moment.Moment) {
    this.router.navigate(['/activites/accueil'], {
      queryParams: {
        date: this.dateUtils.toFrenchFormat(date.toDate()),
        user_id: this.currentUser?.id,
      }
    });
  }

}
