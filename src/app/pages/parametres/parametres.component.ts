import {Component} from '@angular/core';
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
  changePasswordSelection = 'changePassword';
  updateFermeSelection = 'updateFerme';
  employesSelection = 'employes';
  parcellesSelection = 'parcelles';
  activitesSelection = 'activites';
  culturesSelection = 'cultures';
  contactSelection = 'contact';

  selected = this.changePasswordSelection;


  constructor() {
  }

  changeSelection = (selection: string) => {
    this.selected = selection;
  }


}
