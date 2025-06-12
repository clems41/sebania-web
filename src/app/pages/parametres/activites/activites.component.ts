import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfigurationService} from '../../../services/configuration.service';
import {FermeService} from '../../../services/ferme.service';
import {Activite} from '../../../models/activite';
import {UpdateActiviteRequest} from '../../../models/ferme/update-activite-request';
import {PickList} from 'primeng/picklist';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-activites',
  imports: [
    PickList,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    UpperCasePipe
  ],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ActivitesComponent implements OnInit {
  allActivites: Activite[] = [];
  sourceActivites: Activite[] = [];
  fermeActivites: { [categorie: string]: Activite[] } = {};
  allFermeActivites: Activite[] = [];
  categories: string[] = ["production", "général", "commercialisation", "administratif", "secondaire"];
  loading: boolean = false;

  constructor(private configurationService: ConfigurationService, private fermeService: FermeService) {
  }

  ngOnInit(): void {
    this.configurationService.getActivites().subscribe((activites) => {
      this.allActivites = activites.sort((a, b) => a.nom.localeCompare(b.nom));
    });
    this.refreshActivites();
  }

  // La liste source ne doit pas inclure les activités déjà présentes dans les activités liées à la ferme
  updateSourceActivites(activites: Activite[]) {
    this.sourceActivites = this.allActivites.filter((activite) => !activites.some((a) => a.id === activite.id));
  }

  updateFermeActivites(activites: Activite[]) {
    this.updateSourceActivites(activites);
    this.allFermeActivites = activites;
    this.fermeActivites = {};
    for (const categorie of this.categories) {
      this.fermeActivites[categorie] = [];
    }
    activites.forEach((activite) => {
      this.fermeActivites[activite.categorie].push(activite);
    });
  }

  refreshActivites(activites?: Activite[]) {
    if (activites) {
      this.updateFermeActivites(activites);
    } else {
      this.fermeService.getCustomActivites().subscribe((activites) => {
        this.updateFermeActivites(activites);
      });
    }
  }

  onSubmit(categorie: string) {
    let request: UpdateActiviteRequest = {
      activites: [],
      categorie: categorie,
    };
    for (const activiteToUpdate of this.fermeActivites[categorie]) {
      request.activites.push(activiteToUpdate.id);
    }
    this.loading = true;
    this.fermeService.updateCustomActivites(request).subscribe(
      {
        next: (activites: Activite[]) => {
          this.refreshActivites(activites);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      }
    )
  }
}
