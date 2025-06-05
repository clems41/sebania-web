import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {Ferme} from '../../models/ferme';
import {FermeService} from '../../services/ferme.service';
import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {UpdateFermeComponent} from './update-ferme/update-ferme.component';
import {EmployesComponent} from './employes/employes.component';
import {ParcellesComponent} from './parcelles/parcelles.component';
import {ActivitesComponent} from './activites/activites.component';
import {CulturesComponent} from './cultures/cultures.component';
import {ContactComponent} from './contact/contact.component';

@Component({
  selector: 'app-parametres',
  imports: [
    NgTemplateOutlet,
    NgClass,
    ChangePasswordComponent,
    NgIf,
    UpdateFermeComponent,
    EmployesComponent,
    ParcellesComponent,
    ActivitesComponent,
    CulturesComponent,
    ContactComponent
  ],
  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent {
  currentUser: User | null = null;
  currentFerme: Ferme | null = null;
  changePasswordSelection = 'changePassword';
  updateFermeSelection = 'updateFerme';
  employesSelection = 'employes';
  parcellesSelection = 'parcelles';
  activitesSelection = 'activites';
  culturesSelection = 'cultures';
  contactSelection = 'contact';

  selected = this.changePasswordSelection;


  constructor(private authService: AuthService, private fermeService: FermeService) {
  }

  ngOnInit(): void {
    this.authService.me().subscribe(user => {
      this.currentUser = user;
    })
    this.fermeService.getFerme().subscribe(ferme => {
      this.currentFerme = ferme;
    })
  }

  changeSelection = (selection: string) => {
    this.selected = selection;
  }

  updateFerme(event: Ferme){
    this.currentFerme = event;
  }


}
