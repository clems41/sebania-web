import {Component, Input, Output, EventEmitter} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {NgOptimizedImage, NgClass} from '@angular/common';

@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  @Input() isMobile: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}

