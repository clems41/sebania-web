import {Component, OnInit} from '@angular/core';
import {VueEnsembleCards} from '../../../models/dashboard/vue-ensemble';
import {DashboardService} from '../../../services/dashboard.service';
import moment from 'moment';
import {StringUtils} from '../../../utils/string-utils';
import 'moment/locale/fr';
import {TacheUtils} from '../../../utils/tache-utils';

@Component({
  selector: 'app-vue-ensemble',
  imports: [],
  templateUrl: './vue-ensemble.component.html',
  styleUrl: './vue-ensemble.component.css'
})
export class VueEnsembleComponent implements OnInit {
  dataCards: VueEnsembleCards | undefined = undefined;

  constructor(private dashboardService: DashboardService, private stringUtils: StringUtils,
              private tacheUtils: TacheUtils) {
    moment.locale('fr');
  }

  ngOnInit(): void {
    this.dashboardService.getVueEnsembleCards().subscribe(data => this.dataCards = data);
  }

  get currentMonthName() {
    return moment.months()[moment().month()]
  }

  getFormattedDuree(duree_minutes: number | undefined): string {
    return this.tacheUtils.getDureeFormatted(duree_minutes ?? 0);
  }


  protected readonly moment = moment;
}
