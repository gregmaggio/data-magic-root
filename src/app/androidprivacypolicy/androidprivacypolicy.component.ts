import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { BaseComponent } from "../base.component";

@Component({
    selector: 'app-androidprivacypolicy',
    templateUrl: './androidprivacypolicy.component.html',
    styleUrls: ['./androidprivacypolicy.component.css']
  })
export class AndroidPrivacyPolicyComponent extends BaseComponent {
  constructor(protected http: HttpClient, protected deviceService: DeviceDetectorService) {
    super(http, deviceService);
  }
}
