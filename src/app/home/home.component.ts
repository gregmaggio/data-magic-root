import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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

  GooglePlacesAPIClick() {
    window.location.href = "https://datamagic.ca/GooglePlaces/";
  }

  SourceCodeClick() {
    window.location.href = "https://github.com/gregmaggio";
  }

  RadarAPIClick() {
    window.location.href = "https://radar-dot-api-project-378578942759.ue.r.appspot.com/";
  }

  NOAAWeatherUsageClick() {
    window.location.href = "https://datamagic.ca/accounting-dashboard/";
  }
}
