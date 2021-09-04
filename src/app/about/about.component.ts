import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { BaseComponent } from "../base.component";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
  })
export class AboutComponent extends BaseComponent {
  constructor(protected http: HttpClient, protected deviceService: DeviceDetectorService) {
    super(http, deviceService);
  }
}
