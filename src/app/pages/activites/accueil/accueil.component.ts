import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/user';
import {Tache} from '../../../models/tache';
import {TacheService} from '../../../services/tache.service';
import {TacheUtils} from '../../../utils/tache-utils';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-accueil',
  imports: [
    ScrollPanelModule,
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  currentUser: User | null = null;
  taches: Tache[] = [];

  constructor(private authService: AuthService, private tacheService: TacheService,
              protected tacheUtils: TacheUtils) {
  }

  ngOnInit(): void {
    this.authService.me().subscribe(user => {
      this.currentUser = user;
      this.tacheService.getAll(user.id, new Date()).subscribe(
        (taches) => {
          this.taches = taches;
        }
      )
    })
  }


}
