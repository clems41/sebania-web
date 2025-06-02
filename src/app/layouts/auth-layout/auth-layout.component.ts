import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {MessagesModule} from 'primeng/messages';

@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterModule,
    MessagesModule
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
