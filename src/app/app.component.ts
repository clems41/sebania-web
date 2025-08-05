import { Component } from '@angular/core';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {Toast, ToastModule} from 'primeng/toast';
import {RouterOutlet} from '@angular/router';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-root',
  imports: [
    MessagesModule,
    MessageModule, Toast,
    ToastModule, RouterOutlet,
    ChartModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
