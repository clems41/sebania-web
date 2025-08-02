import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {TopBarComponent} from './top-bar/top-bar.component';
import {LateralBarComponent} from './lateral-bar/lateral-bar.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, TopBarComponent, LateralBarComponent, NgOptimizedImage],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  isMobile: boolean;
  isAndroid: boolean;
  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.isAndroid = this.deviceService.getDeviceInfo()['os'] == "Android";
  }

}
