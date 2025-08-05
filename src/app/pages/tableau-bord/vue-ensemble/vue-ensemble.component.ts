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

  get previousYear(): number {
    return moment().subtract(1, 'year').year();
  }

  get tempsTravailComparaison(): number | undefined {
    if (!this.dataCards) {
      return undefined;
    }
    return (this.dataCards.temps_travail_mois_actuel_en_minutes - this.dataCards.temps_travail_mois_annee_precedente_en_minutes)/
      this.dataCards.temps_travail_mois_annee_precedente_en_minutes * 100;
  }

  getFormattedDuree(duree_minutes: number | undefined): string {
    return this.tacheUtils.getDureeFormatted(duree_minutes ?? 0);
  }


  protected readonly moment = moment;
}
