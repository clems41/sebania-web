import {Component, Input, OnInit, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf, NgClass} from '@angular/common';

@Component({
  selector: 'app-lateral-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgClass
  ],
  templateUrl: './lateral-bar.component.html',
  styleUrl: './lateral-bar.component.css'
})
export class LateralBarComponent implements OnInit {
  @Input() isMobile: boolean = false;
  isCollapsed = false;
  isOpen = false; // Pour mobile : état d'ouverture de la sidebar

  // Variables pour la détection de swipe
  private startX = 0;
  private currentX = 0;
  private isDragging = false;
  private swipeThreshold = 50; // Distance minimum pour déclencher le swipe
  private edgeThreshold = 20; // Zone sensible depuis le bord gauche

  constructor() {}

  ngOnInit(): void {
    if (this.isMobile) {
      this.isOpen = false; // Sur mobile, fermé par défaut
      this.isCollapsed = false; // Pas de collapse sur mobile, juste show/hide
    } else {
      this.isCollapsed = false; // Sur desktop, visible par défaut
      this.isOpen = true; // Toujours ouvert sur desktop
    }
  }

  toggleCollapse() {
    if (this.isMobile) {
      this.isOpen = !this.isOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  // Fermer la sidebar quand on clique à l'extérieur (mobile uniquement)
  closeSidebar() {
    if (this.isMobile && this.isOpen) {
      this.isOpen = false;
    }
  }

  // Gérer les clics sur l'overlay pour fermer (éviter les conflits avec le swipe)
  onOverlayClick(event: Event) {
    // S'assurer qu'on ne ferme pas pendant un swipe
    if (!this.isDragging) {
      this.closeSidebar();
    }
    event.stopPropagation();
  }

  // Toggle la sidebar (appelé depuis le layout principal)
  toggleSidebar() {
    if (this.isMobile) {
      this.isOpen = !this.isOpen;
    }
  }

  // Fermer la sidebar lors de la navigation (mobile uniquement)
  onNavigationClick() {
    if (this.isMobile && this.isOpen) {
      this.isOpen = false;
    }
  }

  // Gestion des événements tactiles pour le swipe
  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (!this.isMobile) return;

    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.currentX = touch.clientX;
    this.isDragging = false;

    // Détecter si le swipe commence depuis le bord gauche (pour ouvrir)
    if (!this.isOpen && touch.clientX <= this.edgeThreshold) {
      this.isDragging = true;
    }
    // Ou si le swipe commence dans la sidebar ouverte (pour fermer)
    else if (this.isOpen && touch.clientX <= 256) {
      this.isDragging = true;
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isMobile || !this.isDragging) return;

    // Prévenir le scroll seulement si on est en train de swiper
    event.preventDefault();
    const touch = event.touches[0];
    this.currentX = touch.clientX;
  }

  @HostListener('window:touchend', ['$event'])
  onTouchEnd() {
    if (!this.isMobile || !this.isDragging) return;

    const deltaX = this.currentX - this.startX;

    if (!this.isOpen) {
      // Si la sidebar est fermée et qu'on swipe vers la droite suffisamment
      if (deltaX > this.swipeThreshold) {
        this.isOpen = true;
      }
    } else {
      // Si la sidebar est ouverte et qu'on swipe vers la gauche suffisamment
      if (deltaX < -this.swipeThreshold) {
        this.isOpen = false;
      }
    }

    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
  }
}
