import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../models/user';
import moment from 'moment';
import 'moment/locale/fr';
import {StringUtils} from '../../../../utils/string-utils';
import {TacheService} from '../../../../services/tache.service';
import {Calendrier, CalendrierJour} from '../../../../models/calendrier/calendrier-semaine';
import {TacheUtils} from '../../../../utils/tache-utils';
import {StatutJour} from '../../../../models/statut-jour';
import {NgClass} from '@angular/common';
import {DateUtils} from '../../../../utils/date-utils';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-semaine',
  imports: [
    NgClass,
    Button
  ],
  templateUrl: './semaine.component.html',
  styleUrl: './semaine.component.css'
})
export class SemaineComponent implements OnInit {
  currentUser: User | undefined;
  @Input() isMobile: boolean = false;
  @Output() onClick: EventEmitter<moment.Moment> = new EventEmitter();
  currentDate: moment.Moment = moment().startOf('isoWeek');
  calendrier: Calendrier | undefined = undefined;
  updateDate: EventEmitter<moment.Moment> = new EventEmitter();

  constructor(private stringUtils: StringUtils, private tacheService: TacheService, protected tacheUtils: TacheUtils,
              private dateUtils: DateUtils) {
    moment.locale('fr');
    this.updateDate.subscribe(date => {
      this.currentDate = date;
      this.loadData();
    });
  }

  @Input() set user(user: User) {
    this.currentUser = user;
    this.loadData();
  }

  get user(): User | undefined {
    return this.currentUser
  }

  ngOnInit(): void {
  }

  loadData() {
    if (this.currentUser) {
      this.tacheService.getCalendrierSemaine(this.year, this.week, this.currentUser.id).subscribe((calendrier: Calendrier) => {
        this.calendrier = calendrier;
      });
    }
  }

  setDateAtToday() {
    this.updateDate.emit(moment());
  }

  getCalendrierJour(day: moment.Moment): CalendrierJour | undefined {
    if (this.calendrier) {
      return this.calendrier.jours.find(jour => {
        return moment(jour.jour, "DD/MM/YYYY").isSame(day, 'day');
      });
    }
    return undefined;
  }

  get monthName() {
    return this.stringUtils.capitalizeFirstLetter(moment.months()[this.currentDate.month()])
  }

  get year() {
    return this.currentDate.year();
  }

  get week() {
    return this.currentDate.week();
  }

  plusMonth() {
    this.updateDate.emit(this.dateUtils.getFirstMondayOfMonth(this.currentDate.add(1, 'month')));
  }

  minusMonth() {
    this.updateDate.emit(this.dateUtils.getFirstMondayOfMonth(this.currentDate.add(-1, 'month')));
  }

  plusWeek() {
    this.updateDate.emit(this.currentDate.add(1, 'week'));
  }

  minusWeek() {
    this.updateDate.emit(this.currentDate.add(-1, 'week'));
  }

  fullDayName(day: moment.Moment) {
    return this.stringUtils.capitalizeFirstLetter(day.format('dddd DD MMMM'))
  }

  get daysList() {
    let week: moment.Moment[] = [];

    for (let i = 0; i < 7; i++) {
      week.push(this.currentDate.clone().add(i, 'days'));
    }

    return week;
  }

  protected readonly StatutJour = StatutJour;
}
