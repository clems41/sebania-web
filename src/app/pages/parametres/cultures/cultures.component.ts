import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../../../services/configuration.service';
import {FermeService} from '../../../services/ferme.service';
import {Culture} from '../../../models/culture';
import {TabsModule} from 'primeng/tabs';
import {UpperCasePipe} from '@angular/common';
import {PickListModule} from 'primeng/picklist';
import {Button} from 'primeng/button';
import {UpdateCultureRequest} from '../../../models/ferme/culture-request';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-cultures',
  imports: [
    TabsModule,
    UpperCasePipe,
    PickListModule,
    Button
  ],
  templateUrl: './cultures.component.html',
  styleUrl: './cultures.component.css'
})
export class CulturesComponent implements OnInit {
  allCultures: Culture[] = [];
  sourceCultures: Culture[] = [];
  fermeCultures: { [categorie: string]: Culture[] } = {};
  categories: string[] = ["feuille", "fruit", "racine", "autres"];
  loading: boolean = false;

  constructor(private configurationService: ConfigurationService, private fermeService: FermeService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.configurationService.getCultures().subscribe((cultures) => {
      this.allCultures = cultures.sort((a, b) => a.nom.localeCompare(b.nom));
    });
    this.refreshCultures();
  }

  // La liste source ne doit pas inclure les cultures déjà présentes dans les cultures liées à la ferme
  updateSourceCultures(cultures: Culture[]) {
    this.sourceCultures = this.allCultures.filter((culture) => !cultures.some((c) => c.id === culture.id));
  }

  updateFermeCultures(cultures: Culture[]) {
    this.updateSourceCultures(cultures);
    this.fermeCultures = {};
    for (const categorie of this.categories) {
      this.fermeCultures[categorie] = [];
    }
    cultures.forEach((culture) => {
      this.fermeCultures[culture.categorie].push(culture);
    });
  }

  refreshCultures(cultures?: Culture[]) {
    if (cultures) {
      this.updateFermeCultures(cultures);
    } else {
      this.fermeService.getCustomCultures().subscribe((cultures) => {
        this.updateFermeCultures(cultures);
      });
    }
  }

  onSubmit(categorie: string) {
    let request: UpdateCultureRequest = {
      cultures: [],
      categorie: categorie,
    };
    for (const cultureToUpdate of this.fermeCultures[categorie]) {
      request.cultures.push(cultureToUpdate.id);
    }
    this.loading = true;
    this.fermeService.updateCustomCultures(request).subscribe(
      {
        next: (cultures: Culture[]) => {
          this.refreshCultures(cultures);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: "La liste des cultures a été mise à jour."
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      }
    )
  }

}
