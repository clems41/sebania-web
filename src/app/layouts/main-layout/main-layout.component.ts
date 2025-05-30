import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {TopBarComponent} from '../../navigation/top-bar/top-bar.component';
import {LateralBarComponent} from '../../navigation/lateral-bar/lateral-bar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, TopBarComponent, LateralBarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
