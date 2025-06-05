import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Ferme} from '../../../models/ferme';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MethodeAgricole} from '../../../models/methode-agricole';
import {ConfigurationService} from '../../../services/configuration.service';
import {FermeRequest} from '../../../models/ferme/ferme-request';
import {FermeService} from '../../../services/ferme.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-update-ferme',
  imports: [
    Button,
    FloatLabel,
    InputNumber,
    InputText,
    MultiSelect,
    ReactiveFormsModule
  ],
  templateUrl: './update-ferme.component.html',
  styleUrl: './update-ferme.component.css'
})
export class UpdateFermeComponent {
  @Input() ferme: Ferme | null = null;
  // @ts-ignore
  @Output() fermeUpdated = new EventEmitter<Ferme>();
  fermeForm: FormGroup;
  loading: boolean = false;
  methodesAgricoles: MethodeAgricole[] = [];

  constructor(private formBuilder: FormBuilder, private configurationService: ConfigurationService,
              private fermeService: FermeService, private messageService: MessageService) {
    this.fermeForm = this.formBuilder.group({
      ferme_nom: ['', [Validators.required]],
      ferme_adresse: ['', []],
      ferme_code_postal: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      ferme_superficie_cultivee: [null, []],
      ferme_methodes_agricoles: [[], [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.patchFermeForm(this.ferme);
    this.configurationService.getMethodesAgricoles().subscribe((methodesAgricoles) => {
        this.methodesAgricoles = methodesAgricoles;
      },
    )
  }

  patchFermeForm(ferme: Ferme | null) {
    console.log(ferme);
    this.fermeForm.patchValue({
      ferme_nom: ferme?.nom,
      ferme_code_postal: ferme?.code_postal,
      ferme_superficie_cultivee: ferme?.superficie_cultivee,
      ferme_methodes_agricoles: ferme?.methodes_agricoles?.map((m) => m.id) || [],
      ferme_adresse: ferme?.adresse,
    })
  }

  onSubmit() {
    if (this.fermeForm.invalid) {
      return;
    }
    const ferme_nom = this.fermeForm.get('ferme_nom')?.value;
    const ferme_code_postal = this.fermeForm.get('ferme_code_postal')?.value;
    const ferme_superficie_cultivee = this.fermeForm.get('ferme_superficie_cultivee')?.value;
    const ferme_methodes_agricoles = this.fermeForm.get('ferme_methodes_agricoles')?.value;
    const ferme_adresse = this.fermeForm.get('ferme_adresse')?.value;

    const query: FermeRequest = {
      nom: ferme_nom,
      adresse: ferme_adresse,
      superficie_cultivee: ferme_superficie_cultivee,
      code_postal: ferme_code_postal,
      methodes_agricoles: ferme_methodes_agricoles,
    }
    this.loading = true;
    this.fermeService.update(query).subscribe(
      {
        next: (ferme: Ferme) => {
          this.fermeForm.reset();
          this.fermeUpdated.emit(ferme);
          this.patchFermeForm(ferme);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: "Les informations ont été mises à jour."
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}
