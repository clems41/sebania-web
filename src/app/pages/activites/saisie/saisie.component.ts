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
import {NgClass, NgIf} from '@angular/common';
import {Select} from 'primeng/select';
import {UserUtils} from '../../../utils/user-utils';
import {FermeService} from '../../../services/ferme.service';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Activite} from '../../../models/activite';
import {debounceTime} from 'rxjs';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { InputNumberModule } from 'primeng/inputnumber';
import {Button} from 'primeng/button';

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
    Button
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
  selectedCategorie: string = 'Production';
  searchControl: FormControl;
  categorieControl: FormControl;
  availableActiviteCategories: string[] = [];
  allCategoriesKey = 'Toutes les catégories';

  constructor(private formBuilder: FormBuilder, private cacheService: CacheService,
              private tacheService: TacheService, private messageService: MessageService,
              private router: Router, private userUtils: UserUtils, private fermeService: FermeService) {
    if (!this.user) {
      this.user = this.cacheService.getCurentUser();
    }
    this.form = this.formBuilder.group({
      activite: [null, [Validators.required]],
      date: [this.date, [Validators.required]],
      user: [this.user.id, [Validators.required]],
      duree_minutes: [null, [Validators.required, Validators.min(1), Validators.max(1440)]],
      parcelles: [[], []],
      quantite: [null, []],
      unite: [null, []],
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
    this.form.get('activite')?.reset();
  }

  onSelectActivite(activite_id: number) {
    this.form.get('activite')?.setValue(activite_id);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const request: TacheRequest = {
      activite_id: this.form.get('activite')?.value,
      commentaire: this.form.get('commentaire')?.value,
      cultures: [],
      date: this.form.get('date')?.value,
      duree_minutes: this.form.get('duree_minutes')?.value,
      parcelle_ids: this.form.get('parcelles')?.value,
      quantite: this.form.get('quantite')?.value,
      unite_id: this.form.get('unite')?.value,
      user_id: this.form.get('user')?.value
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
          this.router.navigate(['/activites/accueil']);
        },
        error: () => {
          this.form.reset();
        }
      }
    )
  }

}
