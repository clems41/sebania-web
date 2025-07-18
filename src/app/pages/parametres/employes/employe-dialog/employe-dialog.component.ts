import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {FermeService} from '../../../../services/ferme.service';
import {EmployeRequest} from '../../../../models/ferme/employe-request';

@Component({
  selector: 'app-parcelle-dialog',
  imports: [
    Button,
    FloatLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    SelectModule
  ],
  templateUrl: './employe-dialog.component.html',
  styleUrl: './employe-dialog.component.css'
})
export class EmployeDialogComponent {
  employeForm: FormGroup;
  loading: boolean = false;

  constructor(private fermeService: FermeService, private messageService: MessageService,
              private formBuilder: FormBuilder, private ref: DynamicDialogRef) {
    this.employeForm = this.formBuilder.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onClose() {
    this.ref.close(false);
  }

  onSubmit() {
    if (this.employeForm.invalid) {
      return;
    }
    const first_name = this.employeForm.get('first_name')?.value;
    const last_name = this.employeForm.get('last_name')?.value;
    const email = this.employeForm.get('email')?.value;
    const request: EmployeRequest = {
      first_name: first_name,
      last_name: last_name,
      email: email,
    }
    this.loading = true;
    this.fermeService.addEmploye(request).subscribe(
      {
        next: _ => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `L'employé ${first_name} ${last_name} a bien été créé.`
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
