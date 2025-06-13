import {Component, Input, OnInit} from '@angular/core';
import {Parcelle, TypeParcelle} from '../../../../models/parcelle';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ParcelleService} from '../../../../services/parcelle.service';
import {MessageService} from 'primeng/api';
import {ParcelleRequest} from '../../../../models/parcelle/parcelle-request';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import {ConfigurationService} from '../../../../services/configuration.service';

@Component({
  selector: 'app-parcelle-dialog',
  imports: [
    Button,
    FloatLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    InputNumber,
    SelectModule
  ],
  templateUrl: './parcelle-dialog.component.html',
  styleUrl: './parcelle-dialog.component.css'
})
export class ParcelleDialogComponent implements OnInit {
  @Input() parcelle: Parcelle | null = null;
  parcelleForm: FormGroup;
  loading: boolean = false;
  types_parcelle: TypeParcelle[] = [];

  constructor(private parcelleService: ParcelleService, private messageService: MessageService,
              private formBuilder: FormBuilder, private ref: DynamicDialogRef,
              private configurationService: ConfigurationService) {
    this.parcelleForm = this.formBuilder.group({
      nom: [null, [Validators.required]],
      type: [null, [Validators.required]],
      longueur: [null, [Validators.required, Validators.min(1)]],
      largeur: [null, [Validators.required, Validators.min(1)]],
      largeur_planche_cm: [null, [Validators.required, Validators.min(1)]],
      nombre_planches: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.parcelleForm.patchValue({
      nom: this.parcelle?.nom || null,
      type: this.parcelle?.type?.id || null,
      longueur: this.parcelle?.longueur || null,
      largeur: this.parcelle?.largeur || null,
      largeur_planche_cm: this.parcelle ? this.parcelle.largeur_planche * 100 : null,
      nombre_planches: this.parcelle?.nombre_planches || null,
    })
    this.configurationService.getTypeParcelles().subscribe((types_parcelle) => {
      this.types_parcelle = types_parcelle;
    })
  }

  onClose() {
    this.ref.close(false);
  }

  onSubmit() {
    if (this.parcelleForm.invalid) {
      return;
    }
    const nom = this.parcelleForm.get('nom')?.value;
    const type_id = this.parcelleForm.get('type')?.value;
    const longueur = this.parcelleForm.get('longueur')?.value;
    const largeur = this.parcelleForm.get('largeur')?.value;
    const largeur_planche_cm = this.parcelleForm.get('largeur_planche_cm')?.value;
    const nombre_planches = this.parcelleForm.get('nombre_planches')?.value;
    const request: ParcelleRequest = {
      nom: nom,
      type_id: type_id,
      longueur: longueur,
      largeur: largeur,
      largeur_planche: largeur_planche_cm / 100,
      nombre_planches: nombre_planches,
    }
    this.loading = true;
    if (this.parcelle) {
      // update
      this.parcelleService.update(this.parcelle.id, request).subscribe(
        {
          next: (parcelle: Parcelle) => {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `La parcelle ${parcelle.nom} a bien été mise à jour.`
            });
            this.ref.close(true);
          },
          error: () => {
            this.loading = false;
            this.ref.close(false);
          }
        }
      );
    } else {
      // create
      this.parcelleService.create(request).subscribe(
        {
          next: (parcelle: Parcelle) => {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `La parcelle ${parcelle.nom} a bien été créée.`
            });
            this.ref.close(true);
          },
          error: () => {
            this.loading = false;
            this.ref.close(false);
          }
        }
      );
    }
  }

}
