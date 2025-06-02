import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {Toast, ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    MessagesModule,
    MessageModule, Toast,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
