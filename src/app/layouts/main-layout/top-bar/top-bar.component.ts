import {Component, Input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  @Input() isMobile: boolean = false;
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}

