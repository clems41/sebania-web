import {Component, Input} from '@angular/core';
import {Tache} from '../../../../models/tache';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modification-tache',
  imports: [],
  templateUrl: './modification-tache.component.html',
  styleUrl: './modification-tache.component.css'
})
export class ModificationTacheComponent {
  @Input() tache: Tache | null = null;
  @Input() field: string = '';
  @Input() cultureTacheIndex: number | null = null;

  constructor(private ref: DynamicDialogRef) {
  }

  onClose() {
    this.ref.close(false);
  }
}
