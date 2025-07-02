import {Component, Input, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {CultureTacheRequest, TacheRequest} from '../../../models/tache/tache-request';
import {User} from '../../../models/user';
import {CacheService} from '../../../services/cache.service';
import {TacheService} from '../../../services/tache.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {FloatLabel} from 'primeng/floatlabel';
import {Calendar} from 'primeng/calendar';
import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';
import {Select} from 'primeng/select';
import {UserUtils} from '../../../utils/user-utils';
import {FermeService} from '../../../services/ferme.service';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Activite} from '../../../models/activite';
import {debounceTime} from 'rxjs';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {Button} from 'primeng/button';
import {TacheUtils} from '../../../utils/tache-utils';
import {DateUtils} from '../../../utils/date-utils';
import { DatePickerModule } from 'primeng/datepicker';
import {NiveauComplexite} from '../../../models/niveau-complexite';
import {Textarea} from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import {MultiSelect} from 'primeng/multiselect';
import {Parcelle} from '../../../models/parcelle';
import {ParcelleService} from '../../../services/parcelle.service';
import {Culture} from '../../../models/culture';
import {Chip} from 'primeng/chip';

@Component({
  selector: 'app-saisie',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    Calendar,
    NgIf,
    Select,
    InputText,
    FormsModule,
    IconField,
    InputIcon,
    ScrollPanelModule,
    NgClass,
    InputNumberModule,
    Button,
    NgTemplateOutlet,
    DatePickerModule,
    Textarea,
    MultiSelect,
    Chip
  ],
  templateUrl: './saisie.component.html',
  styleUrl: './saisie.component.css'
})
export class SaisieComponent implements OnInit {
  form: FormGroup;
  @Input() date = new Date();
  @Input() user: User | null = null;
  availableUsers: User[] = [];
  availableActivites: Activite[] = [];
  availableCultures: Culture[] = [];
  filteredActivites: Activite[] = [];
  filteredCultures: Culture[] = [];
  selectedCultures: Culture[] = [];
  searchActiviteControl: FormControl;
  categorieActiviteControl: FormControl;
  searchCultureControl: FormControl;
  categorieCultureControl: FormControl;
  availableActiviteCategories: string[] = [];
  availableCultureCategories: string[] = [];
  allCategoriesKey = 'Toutes les catégories';
  currentPage: number = 1;
  availableParcelles: Parcelle[] = [];
  selectedActivite: Activite | undefined = undefined;

  constructor(private formBuilder: FormBuilder, private cacheService: CacheService,
              private tacheService: TacheService, private messageService: MessageService,
              private router: Router, private userUtils: UserUtils, private fermeService: FermeService,
              protected tacheUtils: TacheUtils, protected dateUtils: DateUtils,
              private parcelleService: ParcelleService) {
    if (!this.user) {
      this.user = this.cacheService.getCurentUser();
    }
    this.form = this.formBuilder.group({
      activite_id: [null, [Validators.required]],
      date: [this.date, [Validators.required]],
      user_id: [this.user.id, [Validators.required]],
      duree: [new Date(1900, 1, 1, 0, 10), [Validators.required, Validators.min(1), Validators.max(1440)]],
      parcelle_ids: [[], []],
      quantite: [null, []],
      unite_id: [null, []],
      commentaire: [null, []],
      cultures: this.formBuilder.array([
      ]),
    });

    this.searchActiviteControl = new FormControl();
    this.searchActiviteControl.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.filterActivites(res);
    });

    this.searchCultureControl = new FormControl();
    this.searchCultureControl.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.filterCultures(res);
    });

    this.categorieActiviteControl = new FormControl();
    this.categorieActiviteControl.setValue(this.allCategoriesKey);
    this.categorieActiviteControl.valueChanges.subscribe(() => {
      this.filterActivites(this.searchActiviteControl.value);
    });

    this.categorieCultureControl = new FormControl();
    this.categorieCultureControl.setValue(this.allCategoriesKey);
    this.categorieCultureControl.valueChanges.subscribe(() => {
      this.filterCultures(this.searchCultureControl.value);
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.availableUsers = [this.user];
      if (this.userUtils.isResponsable(this.user)) {
        this.fermeService.getFerme().subscribe(ferme => {
          this.availableUsers.push(...ferme.employes);
        });
      }
    }
    this.fermeService.getCustomActivites().subscribe(activites => {
      this.availableActivites = activites;
      this.filteredActivites = activites;
      this.availableActiviteCategories = [this.allCategoriesKey, ...new Set(activites.map(activite => String(activite.categorie).charAt(0).toUpperCase() + String(activite.categorie).slice(1)))];
    });
    this.parcelleService.getAll().subscribe(parcelles => {
      this.availableParcelles = parcelles;
    });
    this.fermeService.getCustomCultures().subscribe(cultures => {
      this.availableCultures = cultures;
      this.filteredCultures = cultures;
      this.availableCultureCategories = [this.allCategoriesKey, ...new Set(cultures.map(culture => String(culture.categorie).charAt(0).toUpperCase() + String(culture.categorie).slice(1)))];
    })
  }

  getSelectedUser(): User | undefined {
    const user_id = this.form.get('user_id')?.value;
    if (user_id && user_id != 0) {
      return this.availableUsers.find((user) => user.id == user_id)
    }
    return undefined;
  }

  getSelectedDureeMinutes(): number | undefined {
    const duree = this.form.get('duree')?.value;
    if (duree) {
      return duree.getHours() * 60 + duree.getMinutes();
    }
    return undefined;
  }

  onSuivant() {
    this.currentPage++;
    if (this.selectedActivite && this.selectedActivite.niveau_complexite <= NiveauComplexite.baseQuantiteParcelles) {
      this.currentPage++;
    }
  }

  onPrecedent() {
    this.currentPage--;
    if (this.selectedActivite && this.selectedActivite.niveau_complexite <= NiveauComplexite.baseQuantiteParcelles) {
      this.currentPage--;
    }
  }

  filterActiviteByCategorie(categorie: string) {
    if (categorie == "" || categorie == this.allCategoriesKey) {
      return;
    }
    this.filteredActivites = this.filteredActivites.filter(activite => {
      return activite.categorie.toLowerCase() == categorie.toLowerCase();
    });
  }

  filterActivites(query: string) {
    this.filteredActivites = this.availableActivites;
    if (query) {
      this.filteredActivites = this.availableActivites.filter(activite => {
        return activite.nom.toLowerCase().includes(query.toLowerCase()) ||
          activite.mots_cles.toLowerCase().includes(query.toLowerCase());
      });
    }
    const categorie: string = this.categorieActiviteControl.value;
    this.filterActiviteByCategorie(categorie);
    this.form.get('activite_id')?.reset();
  }

  onSelectActivite(activite: Activite) {
    this.form.get('activite_id')?.setValue(activite.id);
    this.selectedActivite = activite;
  }

  filterCultureByCategorie(categorie: string) {
    if (categorie == "" || categorie == this.allCategoriesKey) {
      return;
    }
    this.filteredCultures = this.filteredCultures.filter(culture => {
      return culture.categorie.toLowerCase() == categorie.toLowerCase();
    });
  }

  filterCultures(query: string) {
    this.filteredCultures = this.availableCultures;
    if (query) {
      this.filteredCultures = this.filteredCultures.filter(culture => {
        return culture.nom.toLowerCase().includes(query.toLowerCase());
      });
    }
    const categorie: string = this.categorieCultureControl.value;
    this.filterCultureByCategorie(categorie);
  }

  onSelectCulture(culture: Culture) {
    const existingIndex = this.selectedCultures.findIndex(item => culture.id == item.id);
    if (existingIndex == -1) {
      this.selectedCultures.push(culture);
      this.addCultureToForm(culture);
    } else {
      this.selectedCultures.splice(existingIndex, 1);
      this.removeCultureToForm(existingIndex);
    }
  }

  onRemoveSelectedCulture(culture: Culture) {
    const existingIndex = this.selectedCultures.findIndex(item => culture.id == item.id);
    this.selectedCultures.splice(existingIndex, 1);
    this.removeCultureToForm(existingIndex);
  }

  isCultureSelected(culture_id: number) {
    return this.selectedCultures.findIndex(item => culture_id == item.id) != -1;
  }

  get cultures() {
    return this.form.get('cultures') as FormArray;
  }

  addCultureToForm(culture: Culture) {
    const cultureForm = this.formBuilder.group({
      culture_id: [culture.id, []],
      parcelle_ids: [[], []],
      quantite: [null, []],
      unite_id: [null, []],
    })
    this.cultures.push(cultureForm);
  }

  removeCultureToForm(index: number) {
    this.cultures.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const date = this.dateUtils.toFrenchFormat(this.form.get('date')?.value)
    const request: TacheRequest = {
      activite_id: this.form.get('activite_id')?.value,
      commentaire: this.form.get('commentaire')?.value,
      cultures: [],
      date: date,
      duree_minutes: this.getSelectedDureeMinutes() ?? 0,
      parcelle_ids: this.form.get('parcelle_ids')?.value,
      quantite: this.form.get('quantite')?.value,
      unite_id: this.form.get('unite_id')?.value,
      user_id: this.form.get('user_id')?.value
    }
    for (const culture of this.cultures.value) {
      const cultureRequest: CultureTacheRequest = {
        culture_id: culture.culture_id,
        parcelle_ids: culture.parcelle_ids,
        quantite: culture.quantite,
        unite_id: culture.unite_id,
      }
      request.cultures.push(cultureRequest);
    }
    this.tacheService.create(request).subscribe(
      {
        next: () => {
          this.form.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `La tâche a été créée avec succès.`
          });
          this.router.navigate(['/activites/accueil'], {
            queryParams: {
              date: date
            }
          });
        },
        error: () => {
          this.form.reset();
        }
      }
    )
  }

  protected readonly NiveauComplexite = NiveauComplexite;
}
