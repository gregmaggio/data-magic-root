import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { BaseComponent } from "../base.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
export class HomeComponent extends BaseComponent {
  constructor(protected http: HttpClient, protected deviceService: DeviceDetectorService) {
    super(http, deviceService);
  }

  hurricaneTracksClick() {
    window.location.href = "hurricanetracks";
  }

  hurricaneAPIClick() {
    window.location.href = "https://datamagic.ca/Hurricane/";
  }

  stationAPIClick() {
    window.location.href = "https://datamagic.ca/Station/";
  }

  WFOAPIClick() {
    window.location.href = "https://datamagic.ca/WFO/";
  }

  TimeZoneAPIClick() {
    window.location.href = "https://datamagic.ca/TimeZone/";
  }

  AccountingAPIClick() {
    window.location.href = "https://datamagic.ca/Accounting/";
  }

  SourceCodeClick() {
    window.location.href = "https://github.com/gregmaggio";
  }
}
