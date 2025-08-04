import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../../../models/user';
import moment from 'moment/moment';

@Component({
  selector: 'app-mois',
  imports: [],
  templateUrl: './mois.component.html',
  styleUrl: './mois.component.css'
})
export class MoisComponent {
  @Input() user: User | undefined = undefined;
  @Output() onClick: EventEmitter<moment.Moment> = new EventEmitter();
}
