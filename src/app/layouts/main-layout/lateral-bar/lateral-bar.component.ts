import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-lateral-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './lateral-bar.component.html',
  styleUrl: './lateral-bar.component.css'
})
export class LateralBarComponent {
  isCollapsed = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

}
