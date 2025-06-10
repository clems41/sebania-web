import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FeedbackRequest} from '../../../models/contact/feedback-request';
import {MessageService} from 'primeng/api';
import { ContactService } from '../../../services/contact.service';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-contact',
  imports: [
    Button,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    Textarea
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private messageService: MessageService,
              private contactService: ContactService) {
    this.contactForm = this.formBuilder.group({
      sujet: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }
    const sujet = this.contactForm.get('sujet')?.value;
    const message = this.contactForm.get('message')?.value;
    const request: FeedbackRequest = {
      sujet,
      message,
    };
    this.loading = true;
    this.contactService.sendFeedback(request).subscribe(
      {
        next: () => {
          this.contactForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: "Votre message a bien été envoyé."
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
