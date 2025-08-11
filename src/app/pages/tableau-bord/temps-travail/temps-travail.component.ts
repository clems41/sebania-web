import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../services/dashboard.service';
import {TempsTravailCards, TempsTravailEvolution} from '../../../models/dashboard/temps-travail';
import moment from 'moment/moment';
import {Culture} from '../../../models/culture';
import {Activite} from '../../../models/activite';
import {Parcelle} from '../../../models/parcelle';
import {FermeService} from '../../../services/ferme.service';
import {ParcelleService} from '../../../services/parcelle.service';
import {TacheUtils} from '../../../utils/tache-utils';
import {DateUtils} from '../../../utils/date-utils';
import {UIChart} from 'primeng/chart';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-temps-travail',
  imports: [
    UIChart,
    Select,
    FormsModule,
    FloatLabel,
    DatePicker
  ],
  templateUrl: './temps-travail.component.html',
  styleUrl: './temps-travail.component.css'
})
export class TempsTravailComponent implements OnInit {
  dataCards: TempsTravailCards | undefined = undefined;
  dataEvolution: any;
  optionsEvolution: any;

  dateDebutFilter: Date = moment().startOf('year').toDate(); // premier jour de l'année
  dateFinFilter: Date = new Date();
  cultureFilter: Culture | undefined = undefined;
  activiteFilter: Activite | undefined = undefined;
  parcelleFilter: Parcelle | undefined = undefined;
  availableCultures: Culture[] = [];
  availableActivites: Activite[] = [];
  availableParcelles: Parcelle[] = [];

  constructor(private dashboardService: DashboardService, private fermeService: FermeService,
              private parcelleService: ParcelleService, private tacheUtils: TacheUtils,
              private dateUtils: DateUtils) {
  }

  ngOnInit(): void {
    this.loadData();
    this.fermeService.getCustomCultures().subscribe(data => this.availableCultures = data.sort((a, b) => a.nom < b.nom ? 1 : 0));
    this.fermeService.getCustomActivites().subscribe(data => this.availableActivites = data.sort((a, b) => a.nom < b.nom ? 1 : 0));
    this.parcelleService.getAll().subscribe(data => this.availableParcelles = data.sort((a, b) => a.nom < b.nom ? 1 : 0));
  }

  loadData() {
    const documentStyle = getComputedStyle(document.documentElement);
    this.dashboardService.getTempsTravailCards(this.dateDebutFilter, this.dateFinFilter, this.cultureFilter?.id, this.activiteFilter?.id, this.parcelleFilter?.id)
      .subscribe(data => this.dataCards = data);
    this.dashboardService.getTempsTravailEvolution(this.dateDebutFilter, this.dateFinFilter, 'jour', this.cultureFilter?.id, this.activiteFilter?.id, this.parcelleFilter?.id)
      .subscribe(data => this.initEvolutionTempsTravail(documentStyle, data))
  }

  getFormattedDuree(duree_minutes: number | undefined): string {
    return this.tacheUtils.getDureeFormatted(duree_minutes ?? 0);
  }

  get tempsTravailComparaison(): number | undefined {
    if (!this.dataCards || !this.dataCards.duree_minutes || !this.dataCards.moyenne_duree_minutes) {
      return undefined;
    }
    return (this.dataCards.duree_minutes - this.dataCards.moyenne_duree_minutes) /
      this.dataCards.moyenne_duree_minutes * 100;
  }

  initEvolutionTempsTravail(documentStyle: CSSStyleDeclaration, data: TempsTravailEvolution) {
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    this.optionsEvolution = {
      maintainAspectRatio: true,
      aspectRatio: 5,
      plugins: {
        legend: {
          display: true,
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
            },
            autoSkip: true,
            maxTicksLimit: 12
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
    this.dataEvolution = {
      labels: data.data.map(item => this.dateUtils.toFrenchString(this.dateUtils.fromFrenchFormat(item.date))),
      datasets: [
        {
          type: 'line',
          fill: false,
          label: "Moyenne des utilisateurs",
          data: data.data.map(item => (item.moyenne_duree_minutes / 60).toFixed(2)),
          backgroundColor: documentStyle.getPropertyValue('--color-intermediaire'),
          borderColor: documentStyle.getPropertyValue('--color-intermediaire-hover'),
        },
        {
          type: 'line',
          label: "Mon temps de travail",
          data: data.data.map(item => (item.duree_minutes / 60).toFixed(2)),
          backgroundColor: documentStyle.getPropertyValue('--color-vertFeuille'),
          borderColor: documentStyle.getPropertyValue('--color-vertFeuille-hover'),
        }
      ]
    };
  }

}
