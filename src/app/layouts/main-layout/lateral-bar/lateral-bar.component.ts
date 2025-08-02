import {Component, Input, OnInit} from '@angular/core';
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
export class LateralBarComponent implements OnInit {
  @Input() isMobile: boolean | undefined;
  isCollapsed = false;

  ngOnInit(): void {
    this.isCollapsed = this.isMobile ?? false;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

}
