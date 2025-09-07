import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {FloatLabelModule} from 'primeng/floatlabel';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {MessageService} from 'primeng/api';
import {TacheService} from '../../../services/tache.service';
import {FermeService} from '../../../services/ferme.service';
import {ParcelleService} from '../../../services/parcelle.service';
import {CacheService} from '../../../services/cache.service';
import {DateUtils} from '../../../utils/date-utils';
import {lastValueFrom} from 'rxjs';
import {TacheRequest} from '../../../models/tache/tache-request';
import {Tache} from '../../../models/tache';
import {Activite} from '../../../models/activite';
import {Culture} from '../../../models/culture';
import {Parcelle} from '../../../models/parcelle';
import {Unite} from '../../../models/unite';
import {User} from '../../../models/user';
import {NiveauComplexite} from '../../../models/niveau-complexite';

@Component({
  selector: 'app-saisie',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule,
    MultiSelectModule,
    InputNumberModule,
    InputTextModule,
    FieldsetModule
  ],
  templateUrl: './saisie.component.html'
})
export class SaisieComponent implements OnInit {
  private tacheService = inject(TacheService);
  private fermeService = inject(FermeService);
  private parcelleService = inject(ParcelleService);
  private cacheService = inject(CacheService);
  private messageService = inject(MessageService);
  private dateUtils = inject(DateUtils);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tacheForm!: FormGroup;
  loading = false;
  isMobile = false;
  isEditMode = false;
  editingTacheId: number | null = null;

  activites: Activite[] = [];
  cultures: Culture[] = [];
  parcelles: Parcelle[] = [];
  unites: Unite[] = [];
  currentUser: User;
  selectedActivite: Activite | null = null;

  NiveauComplexite = NiveauComplexite;

  constructor() {
    this.currentUser = this.cacheService.getCurentUser();
    this.checkIsMobile();
  }

  ngOnInit() {
    this.initForm();
    this.loadData();
    
    // Check for edit mode
    this.route.queryParams.subscribe(params => {
      const tacheId = params['tache_id'];
      if (tacheId) {
        this.isEditMode = true;
        this.editingTacheId = +tacheId;
        this.loadExistingTask(+tacheId);
      }
    });
  }

  private checkIsMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  private initForm() {
    // Create default time value of 1 hour (01:00)
    const defaultTime = new Date();
    defaultTime.setHours(1, 0, 0, 0);

    this.tacheForm = this.fb.group({
      date: [new Date(), Validators.required],
      user_id: [this.currentUser.id, Validators.required],
      activite_id: [null, Validators.required],
      duree_time: [defaultTime, Validators.required],
      duree_minutes: [60, [Validators.required, Validators.min(1)]],
      commentaire: [''],
      parcelle_ids: [[]],
      quantite: [null],
      unite_id: [null],
      cultures: this.fb.array([])
    });

    this.tacheForm.get('activite_id')?.valueChanges.subscribe(activiteId => {
      this.onActiviteChange(activiteId);
    });

    // Listen to time changes to update total duration
    this.tacheForm.get('duree_time')?.valueChanges.subscribe(timeValue => {
      this.updateTotalDurationFromTime(timeValue);
    });
  }

  private async loadData() {
    this.loading = true;

    try {
      const [activites, cultures, parcelles] = await Promise.all([
        lastValueFrom(this.fermeService.getCustomActivites()),
        lastValueFrom(this.fermeService.getCustomCultures()),
        lastValueFrom(this.parcelleService.getAll())
      ]);

      this.activites = activites || [];
      this.cultures = cultures || [];
      this.parcelles = parcelles || [];
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les données nécessaires'
      });
      this.loading = false;
    }
  }

  private async loadExistingTask(tacheId: number) {
    this.loading = true;

    try {
      const tache = await lastValueFrom(this.tacheService.get(tacheId));
      this.populateFormWithTask(tache);
    } catch (error) {
      console.error('Erreur lors du chargement de la tâche:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger la tâche à modifier'
      });
      // Redirect to create mode if task not found
      this.isEditMode = false;
      this.editingTacheId = null;
      this.router.navigate(['/activites/saisie']);
    } finally {
      this.loading = false;
    }
  }

  private populateFormWithTask(tache: Tache) {
    // Convert duration to time object
    const durationTime = new Date();
    const hours = Math.floor(tache.duree_minutes / 60);
    const minutes = tache.duree_minutes % 60;
    durationTime.setHours(hours, minutes, 0, 0);

    // Parse date from French format
    const taskDate = this.dateUtils.fromFrenchFormat(tache.date);

    // Populate main form fields
    this.tacheForm.patchValue({
      date: taskDate,
      user_id: tache.user.id,
      activite_id: tache.activite.id,
      duree_time: durationTime,
      duree_minutes: tache.duree_minutes,
      commentaire: tache.commentaire || '',
      parcelle_ids: tache.parcelles?.map(p => p.id) || [],
      quantite: tache.quantite || null,
      unite_id: tache.unite?.id || null
    });

    // Set selected activity to trigger visibility logic
    this.selectedActivite = tache.activite;
    this.unites = tache.activite.unites || [];

    // Clear existing cultures and populate with task cultures
    this.culturesFormArray.clear();
    if (tache.cultures && tache.cultures.length > 0) {
      tache.cultures.forEach(cultureTache => {
        const cultureForm = this.fb.group({
          culture_id: [cultureTache.culture.id, Validators.required],
          parcelle_ids: [cultureTache.parcelles?.map(p => p.id) || []],
          quantite: [cultureTache.quantite || null],
          unite_id: [cultureTache.unite?.id || null]
        });
        this.culturesFormArray.push(cultureForm);
      });
    }
  }

  private onActiviteChange(activiteId: number) {
    if (!activiteId) {
      this.selectedActivite = null;
      this.unites = [];
      this.culturesFormArray.clear();
      return;
    }

    this.selectedActivite = this.activites.find(a => a.id === activiteId) || null;
    if (this.selectedActivite) {
      this.unites = this.selectedActivite.unites || [];

      // Reset fields based on complexity
      this.resetFormBasedOnComplexity();
    }
  }

  private resetFormBasedOnComplexity() {
    if (!this.selectedActivite) return;

    // Reset optional fields
    this.tacheForm.patchValue({
      parcelle_ids: [],
      quantite: null,
      unite_id: null
    });

    // Clear cultures array
    this.culturesFormArray.clear();
  }

  get culturesFormArray(): FormArray {
    return this.tacheForm.get('cultures') as FormArray;
  }

  private createCultureForm(): FormGroup {
    return this.fb.group({
      culture_id: [null, Validators.required],
      parcelle_ids: [[]],
      quantite: [null],
      unite_id: [null]
    });
  }

  // Methods for field visibility based on complexity level
  shouldShowParcelleIds(): boolean {
    if (!this.selectedActivite) return false;
    const complexity = this.selectedActivite.niveau_complexite;
    return complexity === NiveauComplexite.baseParcelles ||
           complexity === NiveauComplexite.baseQuantiteParcelles;
  }

  shouldShowQuantite(): boolean {
    if (!this.selectedActivite) return false;
    const complexity = this.selectedActivite.niveau_complexite;
    return complexity === NiveauComplexite.baseQuantite ||
           complexity === NiveauComplexite.baseQuantiteParcelles;
  }

  shouldShowCultures(): boolean {
    if (!this.selectedActivite) return false;
    const complexity = this.selectedActivite.niveau_complexite;
    return complexity >= NiveauComplexite.cultures;
  }

  shouldShowCultureParcelleIds(): boolean {
    if (!this.selectedActivite) return false;
    const complexity = this.selectedActivite.niveau_complexite;
    return complexity === NiveauComplexite.culturesParcelles ||
           complexity === NiveauComplexite.culturesQuantiteParcelles;
  }

  shouldShowCultureQuantite(): boolean {
    if (!this.selectedActivite) return false;
    const complexity = this.selectedActivite.niveau_complexite;
    return complexity === NiveauComplexite.culturesQuantite ||
           complexity === NiveauComplexite.culturesQuantiteParcelles;
  }

  // Culture management methods
  addCultureForm() {
    this.culturesFormArray.push(this.createCultureForm());
  }

  removeCultureForm(index: number) {
    this.culturesFormArray.removeAt(index);
  }

  canRemoveCulture(): boolean {
    return this.culturesFormArray.length > 0;
  }

  // Validation and submission
  onSubmit() {
    if (this.tacheForm.valid) {
      this.loading = true;

      const formValue = this.tacheForm.value;
      const request: TacheRequest = {
        date: this.dateUtils.toFrenchFormat(formValue.date),
        user_id: formValue.user_id,
        activite_id: formValue.activite_id,
        duree_minutes: formValue.duree_minutes,
        commentaire: formValue.commentaire || '',
        parcelle_ids: formValue.parcelle_ids || [],
        quantite: formValue.quantite || null,
        unite_id: formValue.unite_id || null,
        cultures: formValue.cultures?.map((culture: any) => ({
          culture_id: culture.culture_id,
          parcelle_ids: culture.parcelle_ids || [],
          quantite: culture.quantite || null,
          unite_id: culture.unite_id || null
        })) || []
      };

      const serviceCall = this.isEditMode && this.editingTacheId 
        ? this.tacheService.update(this.editingTacheId, request)
        : this.tacheService.create(request);

      const successMessage = this.isEditMode ? 'Tâche modifiée avec succès' : 'Tâche créée avec succès';
      const errorMessage = this.isEditMode ? 'Impossible de modifier la tâche' : 'Impossible de créer la tâche';

      serviceCall.subscribe({
        next: (tache) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: successMessage
          });
          this.router.navigate(['/activites/accueil'], {
            queryParams: {
              date: request.date,
              user_id: this.currentUser?.id,
            }
          });
        },
        error: (error) => {
          console.error(`Erreur lors de ${this.isEditMode ? 'la modification' : 'la création'} de la tâche:`, error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: errorMessage
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.tacheForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires'
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/activites/accueil']);
  }

  // Helper methods for template
  private updateTotalDurationFromTime(timeValue: Date | null) {
    if (!timeValue) {
      this.tacheForm.patchValue({ duree_minutes: 0 }, { emitEvent: false });
      return;
    }

    const hours = timeValue.getHours();
    const minutes = timeValue.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    this.tacheForm.patchValue({ duree_minutes: totalMinutes }, { emitEvent: false });
  }

}
