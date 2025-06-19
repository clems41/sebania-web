import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TacheRequest} from '../../../models/tache/tache-request';
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
    MultiSelect
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
  filteredActivites: Activite[] = [];
  searchControl: FormControl;
  categorieControl: FormControl;
  availableActiviteCategories: string[] = [];
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
    });

    this.searchControl = new FormControl();
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(res => {
      this.filterActivites(res);
    });

    this.categorieControl = new FormControl();
    this.categorieControl.setValue(this.allCategoriesKey);
    this.categorieControl.valueChanges.subscribe(() => {
      this.filterActivites(this.searchControl.value);
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

  filterByCategorie(categorie: string) {
    if (categorie == "" || categorie == this.allCategoriesKey) {
      return;
    }
    this.filteredActivites = this.filteredActivites.filter(activite => {
      return activite.categorie.toLowerCase() == categorie.toLowerCase();
    });
  }

  filterActivites(query: string) {
    if (!query || query === "") {
      this.filteredActivites = this.availableActivites;
    } else {
      this.filteredActivites = this.availableActivites.filter(activite => {
        return activite.nom.toLowerCase().includes(query.toLowerCase()) ||
          activite.mots_cles.toLowerCase().includes(query.toLowerCase());
      });
    }
    const categorie: string = this.categorieControl.value;
    this.filterByCategorie(categorie);
    this.form.get('activite_id')?.reset();
  }

  onSelectActivite(activite: Activite) {
    this.form.get('activite_id')?.setValue(activite.id);
    this.selectedActivite = activite;
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
