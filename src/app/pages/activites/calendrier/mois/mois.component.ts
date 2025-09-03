import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../models/user';
import moment from 'moment/moment';
import {Button} from 'primeng/button';
import {NgClass, NgForOf} from '@angular/common';
import {StringUtils} from '../../../../utils/string-utils';
import {Calendrier, CalendrierJour} from '../../../../models/calendrier/calendrier-semaine';
import {TacheService} from '../../../../services/tache.service';
import {StatutJour} from '../../../../models/statut-jour';

@Component({
  selector: 'app-mois',
  imports: [
    NgForOf,
    NgClass,
    Button
  ],
  templateUrl: './mois.component.html',
  styleUrl: './mois.component.css'
})
export class MoisComponent implements OnInit {
  @Input() isMobile: boolean = false;
  @Output() onClick: EventEmitter<moment.Moment> = new EventEmitter();
  currentUser: User | undefined;
  currentDate = moment(); // mois affiché
  days: moment.Moment[] = [];
  calendrier: Calendrier | undefined;
  updateDate: EventEmitter<moment.Moment> = new EventEmitter();

  constructor(private stringUtils: StringUtils, private tacheService: TacheService) {
    moment.locale('fr');
    this.updateDate.subscribe(date => {
      this.currentDate = date;
      this.generateCalendar();
      this.loadData();
    });
  }

  @Input() set user(user: User) {
    this.currentUser = user;
    if (this.days.length == 0) {
      this.generateCalendar();
    }
    this.loadData();
  }

  get user(): User | undefined {
    return this.currentUser
  }

  ngOnInit() {
  }

  loadData() {
    if (this.currentUser) {
      this.tacheService.getCalendrierMois(this.year, this.month, this.currentUser.id).subscribe((calendrier: Calendrier) => {
        this.calendrier = calendrier;
      });
    }
  }

  generateCalendar() {
    const startOfMonth = this.currentDate.clone().startOf('month');
    const endOfMonth = this.currentDate.clone().endOf('month');

    const startDay = startOfMonth.clone().startOf('week');
    const endDay = endOfMonth.clone().endOf('week');

    const date = startDay.clone();
    this.days = [];

    while (!date.isAfter(endDay, 'day')) {
      this.days.push(date.clone());
      date.add(1, 'day');
    }
  }

  get monthName() {
    return this.stringUtils.capitalizeFirstLetter(moment.months()[this.currentDate.month()])
  }

  get month() {
    return this.currentDate.month() + 1;
  }

  get year() {
    return this.currentDate.year();
  }

  goToPreviousMonth() {
    this.updateDate.emit(this.currentDate.clone().subtract(1, 'month'));
  }

  goToNextMonth() {
    this.updateDate.emit(this.currentDate.clone().add(1, 'month'));
  }

  goToToday() {
    this.updateDate.emit(moment());
  }

  isToday(day: moment.Moment): boolean {
    return day.isSame(moment(), 'day');
  }

  isCurrentMonth(day: moment.Moment): boolean {
    return day.month() === this.currentDate.month();
  }

  getCalendrierJour(day: moment.Moment): CalendrierJour | undefined {
    if (this.calendrier) {
      return this.calendrier.jours.find(jour => {
        return moment(jour.jour,"DD/MM/YYYY").isSame(day, 'day');
      });
    }
    return undefined;
  }

  protected readonly StatutJour = StatutJour;
}
