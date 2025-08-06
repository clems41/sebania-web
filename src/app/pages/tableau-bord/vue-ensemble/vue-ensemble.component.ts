import {Component, OnInit} from '@angular/core';
import {
  VueEnsembleCards, VueEnsembleEvolutionTempsTravail,
  VueEnsembleRepartitionActivite,
  VueEnsembleRepartitionCulture,
  VueEnsembleRepartitionParcelle
} from '../../../models/dashboard/vue-ensemble';
import {DashboardService} from '../../../services/dashboard.service';
import moment from 'moment';
import {StringUtils} from '../../../utils/string-utils';
import 'moment/locale/fr';
import {TacheUtils} from '../../../utils/tache-utils';
import {ChartModule} from 'primeng/chart';
import {ChartUtils} from '../../../utils/chart-utils';

@Component({
  selector: 'app-vue-ensemble',
  imports: [ChartModule],
  templateUrl: './vue-ensemble.component.html',
  styleUrl: './vue-ensemble.component.css'
})
export class VueEnsembleComponent implements OnInit {
  dataCards: VueEnsembleCards | undefined = undefined;
  dataRepartitionActivite: any;
  optionsRepartitionActivite: any;
  dataRepartitionCulture: any;
  optionsRepartitionCulture: any;
  dataRepartitionParcelle: any;
  optionsRepartitionParcelle: any;
  dataEvolutionTempsTravail: any;
  optionsEvolutionTempsTravail: any;

  constructor(private dashboardService: DashboardService, private stringUtils: StringUtils,
              private tacheUtils: TacheUtils, private chartUtils: ChartUtils) {
    moment.locale('fr');
  }

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    this.dashboardService.getVueEnsembleCards().subscribe(data => this.dataCards = data);
    this.dashboardService.getVueEnsembleRepartitionActivite().subscribe((data) => this.initRepartitionActivite(documentStyle, data));
    this.dashboardService.getVueEnsembleRepartitionCulture().subscribe((data) => this.initRepartitionCulture(documentStyle, data));
    this.dashboardService.getVueEnsembleRepartitionParcelle().subscribe((data) => this.initRepartitionParcelle(documentStyle, data));
    this.dashboardService.getVueEnsembleEvolutionTempsTravail().subscribe((data) => this.initEvolutionTempsTravail(documentStyle, data));
  }

  initRepartitionActivite(documentStyle: CSSStyleDeclaration, data: VueEnsembleRepartitionActivite) {
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.optionsRepartitionActivite = {
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.dataRepartitionActivite = {
      labels: data.data.map(item => item.categorie_nom),
      datasets: [
        {
          data: data.data.map(item => Math.round(item.duree_minutes / 60)).sort(),
          backgroundColor: this.chartUtils.getRandomColors(data.data.length),
        }
      ]
    };
  }

  initRepartitionCulture(documentStyle: CSSStyleDeclaration, data: VueEnsembleRepartitionCulture) {
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.optionsRepartitionCulture = {
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.dataRepartitionCulture = {
      labels: data.data.map(item => item.culture_nom),
      datasets: [
        {
          data: data.data.map(item => Math.round(item.duree_minutes / 60)),
          backgroundColor: this.chartUtils.getRandomColors(data.data.length),
        }
      ]
    };
  }

  initRepartitionParcelle(documentStyle: CSSStyleDeclaration, data: VueEnsembleRepartitionParcelle) {
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.optionsRepartitionParcelle = {
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.dataRepartitionParcelle = {
      labels: data.data.map(item => item.parcelle_nom),
      datasets: [
        {
          data: data.data.map(item => Math.round(item.duree_minutes / 60)),
          backgroundColor: this.chartUtils.getRandomColors(data.data.length),
        }
      ]
    };
  }

  initEvolutionTempsTravail(documentStyle: CSSStyleDeclaration, data: VueEnsembleEvolutionTempsTravail) {
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    this.optionsEvolutionTempsTravail = {
      maintainAspectRatio: true,
      aspectRatio: 5,
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColor
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    this.dataEvolutionTempsTravail = {
      labels: data.data.map(item => item.mois),
      datasets: [
        {
          type: 'line',
          fill: false,
          label: "Moyenne des utilisateurs",
          data: data.data.map(item => Math.round(item.moyenne_duree_minutes / 60)),
          backgroundColor: documentStyle.getPropertyValue('--color-intermediaire'),
          borderColor: documentStyle.getPropertyValue('--color-intermediaire-hover'),
        },
        {
          type: 'bar',
          label: "Mes heures de travail",
          data: data.data.map(item => Math.round(item.duree_minutes / 60)),
          backgroundColor: documentStyle.getPropertyValue('--color-vertFeuille'),
          borderColor: documentStyle.getPropertyValue('--color-vertFeuille-hover'),
        }
      ]
    };
  }

  get currentMonthName() {
    return moment.months()[moment().month()]
  }

  get currentYear(): number {
    return moment().year();
  }

  get previousYear(): number {
    return moment().subtract(1, 'year').year();
  }

  get tempsTravailComparaison(): number | undefined {
    if (!this.dataCards) {
      return undefined;
    }
    return (this.dataCards.temps_travail_mois_actuel_en_minutes - this.dataCards.temps_travail_mois_annee_precedente_en_minutes) /
      this.dataCards.temps_travail_mois_annee_precedente_en_minutes * 100;
  }

  getFormattedDuree(duree_minutes: number | undefined, minutes_included: boolean = true): string {
    return this.tacheUtils.getDureeFormatted(duree_minutes ?? 0, minutes_included);
  }


  protected readonly moment = moment;
}
