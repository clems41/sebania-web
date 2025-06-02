import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-accueil',
  imports: [],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  data: any;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.me().subscribe(data => {
      this.data = data;
    })
  }


}
