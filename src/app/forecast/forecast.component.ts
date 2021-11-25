import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { BaseComponent } from "../base.component";
import { DWMLService } from "../service/dwml.service";
import { Station, StationService } from "../service/station.service";
import { parse } from 'fast-xml-parser';
import { GooglePlacesService, Place, Prediction } from "../service/googleplaces.service";
import { DiscussionService } from "../service/discussion.service";

@Component({
    selector: 'app-forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.css']
  })
export class ForecastComponent extends BaseComponent implements AfterViewInit {
    static theComponent:ForecastComponent;
    static discussionStart:string = "000";
    static discussionEnd:string = "</pre>";
    latitude!:number;
    longitude!:number;
    station!:Station;
    dwml!:any;
    predictions!:Prediction[];
    discussion!:string;

    constructor(protected http: HttpClient, protected deviceService: DeviceDetectorService) {
        super(http, deviceService);
        ForecastComponent.theComponent = this;
        navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.loadStation();
            }
        );
    }

    ngAfterViewInit(): void {
        var search:HTMLInputElement = <HTMLInputElement>document.getElementById("search");
        search.onkeyup = function() {
            ForecastComponent.theComponent.searchKeyUp();
        };
        ForecastComponent.theComponent.headerClick('observation');
    }

    searchKeyUp() {
        var search:HTMLInputElement = <HTMLInputElement>document.getElementById("search");
        var searchText:string = search.value;
        if (searchText.length > 1) {
            this.loadPredictions(searchText);
        }
    }

    searchClick(eventObj:any) {
        if (eventObj && eventObj.target) {
            eventObj.target.select();
        }
    }

    searchOptionSelected(prediction:Prediction) {
        ForecastComponent.theComponent.loadPlace(prediction.placeId);
    }

    displaySearchOption(prediction:Prediction) {
        return prediction.description;
    }

    headerClick(headerName:string) {
        var observationDiv:HTMLDivElement = <HTMLDivElement>document.getElementById('observationDiv');
        var forecastDiv:HTMLDivElement = <HTMLDivElement>document.getElementById('forecastDiv');
        var discussionDiv:HTMLDivElement = <HTMLDivElement>document.getElementById('discussionDiv');
        if (headerName) {
            if (headerName.toLowerCase() == 'observation') {
                observationDiv.className = 'visible';
                forecastDiv.className = 'invisible';
                discussionDiv.className = 'invisible';
            } else if (headerName.toLowerCase() == 'forecast') {
                observationDiv.className = 'invisible';
                forecastDiv.className = 'visible';
                discussionDiv.className = 'invisible';
            } else if (headerName.toLowerCase() == 'discussion') {
                observationDiv.className = 'invisible';
                forecastDiv.className = 'invisible';
                discussionDiv.className = 'visible';
            }
        }
        return false;
    }

    loadPredictions(searchText:string) {
        var service:GooglePlacesService = new GooglePlacesService(this.http);
        service.predictions(searchText).subscribe(
            (predictions:Prediction[]) => {
                this.predictions = predictions;
            }
        );
    }

    loadPlace(placeId:string) {
        var service:GooglePlacesService = new GooglePlacesService(this.http);
        service.place(placeId).subscribe(
            (place:Place) => {
                this.latitude = place.latitude;
                this.longitude = place.longtitude;
                this.loadStation();
            }
        );
    }

    loadStation() {
        var service:StationService = new StationService(this.http);
        service.nearest(this.latitude, this.longitude).subscribe(
            (station:Station) => {
                this.station = station;
                this.loadDWML();
                this.loadDiscussion();
            }
        );
    }

    loadDiscussion() {
        var service:DiscussionService = new DiscussionService(this.http);
        service.load(this.station.wfo).subscribe(
            (discussion:string) => {
                var buffer:string = "";
                var lines:string[] = discussion.split("\n");
                var started:boolean = false;
                for (var ii:number = 0; ii < lines.length; ii++) {
                    var currentLine:string = lines[ii].trim();
                    if (!started) {
                        if (currentLine.toLowerCase().indexOf(ForecastComponent.discussionStart) > -1) {
                            started = true;
                        }
                    } else {
                        if (currentLine.toLowerCase().indexOf(ForecastComponent.discussionEnd) > -1) {
                            break;
                        }
                        buffer += currentLine;
                        buffer += "<br />";
                    }                    
                }
                this.discussion = buffer;
                this.renderDiscussion();
            }
        );
    }

    loadDWML() {
        var service:DWMLService = new DWMLService(this.http);
        service.load(this.latitude, this.longitude, "").subscribe(
            (xml:string) => {
                var obj:any = parse(xml);
                this.dwml = obj.dwml;
                this.renderObservation();
                this.renderForecast();
            }
        );
    }

    renderDiscussion() {
        if (this.discussion) {
            var discussionDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("discussionDiv");
            //discussionDiv.className = "visible";
            discussionDiv.innerHTML = this.discussion;
        }
    }
    
    renderObservation() {        
        if (this.dwml && this.dwml.data && (this.dwml.data.length > 1)) {
            var data:any = this.dwml.data[1];
            if (data.location && data.location["area-description"]) {
                var locationDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("locationDiv");
                var location:HTMLSpanElement = <HTMLSpanElement>document.getElementById("location");
                locationDiv.className = "visible";
                location.innerHTML = data.location["area-description"];
            }
            if (data.parameters && data.parameters["conditions-icon"] && data.parameters["conditions-icon"]["icon-link"]) {
                var conditionsIconDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("conditionsIconDiv");
                var conditionsIcon:HTMLImageElement = <HTMLImageElement>document.getElementById("conditionsIcon");
                conditionsIconDiv.className = "visible";
                conditionsIcon.src = data.parameters["conditions-icon"]["icon-link"];
            }
            if (data.parameters && data.parameters.temperature && (data.parameters.temperature.length > 0)) {
                var temperatureDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("temperatureDiv");
                var temperature:HTMLSpanElement = <HTMLSpanElement>document.getElementById("temperature");
                temperatureDiv.className = "visible";
                temperature.innerHTML = data.parameters.temperature[0].value + "&deg;F";
            }
            if (data.parameters && data.parameters.temperature && (data.parameters.temperature.length > 1)) {
                var dewPointDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("dewPointDiv");
                var dewPoint:HTMLSpanElement = <HTMLSpanElement>document.getElementById("dewPoint");
                dewPointDiv.className = "visible";
                dewPoint.innerHTML = data.parameters.temperature[1].value + "&deg;F";
            }
            if (data.parameters && data.parameters.humidity) {
                var humidityDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("humidityDiv");
                var humidity:HTMLSpanElement = <HTMLSpanElement>document.getElementById("humidity");
                humidityDiv.className = "visible";
                humidity.innerHTML = data.parameters.humidity.value + "%";
            }
            if (data.parameters && data.parameters.pressure) {
                var pressureDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("pressureDiv");
                var pressure:HTMLSpanElement = <HTMLSpanElement>document.getElementById("pressure");
                pressureDiv.className = "visible";
                pressure.innerHTML = data.parameters.pressure.value + " IN";
            }
            if (data.parameters && data.parameters["wind-speed"] && (data.parameters["wind-speed"].length > 1)) {
                var windDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("windDiv");
                var wind:HTMLSpanElement = <HTMLSpanElement>document.getElementById("wind");
                windDiv.className = "visible";
                var windGust:number = parseInt(data.parameters["wind-speed"][0].value);
                var windSpeed:number = parseInt(data.parameters["wind-speed"][1].value);
                wind.innerHTML = "";
                if (!isNaN(windSpeed)) {
                    wind.innerHTML += windSpeed.toString() + " MPH";
                }
                if (!isNaN(windGust)) {
                    wind.innerHTML += (" Gusting to " + windGust.toString() + " MPH");
                }
            }
            if (data.parameters && data.parameters.weather && data.parameters.weather["weather-conditions"] && (data.parameters.weather["weather-conditions"].length > 1) && data.parameters.weather["weather-conditions"][1] && data.parameters.weather["weather-conditions"][1].value && data.parameters.weather["weather-conditions"][1].value.visibility) {
                var visibilityDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("visibilityDiv");
                var visibility:HTMLSpanElement = <HTMLSpanElement>document.getElementById("visibility");
                visibilityDiv.className = "visible";
                visibility.innerHTML = data.parameters.weather["weather-conditions"][1].value.visibility.toString() + " STATUTE MILES";
            }            
        }
    }

    renderForecast() {
        if (this.dwml && this.dwml.data && (this.dwml.data.length > 0)) {
            var data:any = this.dwml.data[0];
            if (data.location && data.location.description) {
                var forecastLocationDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("forecastLocationDiv");
                var forecastLocation:HTMLSpanElement = <HTMLSpanElement>document.getElementById("forecastLocation");
                forecastLocationDiv.className = "visible";
                forecastLocation.innerHTML = data.location.description;
            }
            var timeLayout:any = data["time-layout"];
            var startValidTime1:string[] = data["time-layout"][0]["start-valid-time"];
            var startValidTime2:string[] = data["time-layout"][1]["start-valid-time"];
            var startValidTime3:string[] = data["time-layout"][2]["start-valid-time"];
            var dateArray1:Date[] = [];
            var dateArray2:Date[] = [];
            var dateArray3:Date[] = [];
            for (var ii = 0; ii < startValidTime1.length; ii++) {
                dateArray1[ii] = new Date(startValidTime1[ii]);
            }
            for (var ii = 0; ii < startValidTime2.length; ii++) {
                dateArray2[ii] = new Date(startValidTime2[ii]);
            }
            for (var ii = 0; ii < startValidTime3.length; ii++) {
                dateArray3[ii] = new Date(startValidTime3[ii]);
            }
            var forecastTable:HTMLTableElement = <HTMLTableElement>document.getElementById("forecastTable");
            forecastTable.className = "visible";
            for (var ii:number = 0, jj:number = 0; ii < dateArray1.length; ii++) {
                var row:HTMLTableRowElement = forecastTable.insertRow();                
                var cell1:HTMLTableCellElement = row.insertCell();
                if (data.parameters && data.parameters["conditions-icon"] && data.parameters["conditions-icon"]["icon-link"]) {
                    cell1.innerHTML = "<img src='" + data.parameters["conditions-icon"]["icon-link"][ii] + "' alt='' />";
                }
                var cell2:HTMLTableCellElement = row.insertCell();
                if (data.parameters && data.parameters.wordedForecast && data.parameters.wordedForecast.text) {
                    cell2.innerHTML = data.parameters.wordedForecast.text[ii];
                }
                var cell3:HTMLTableCellElement = row.insertCell();
                if (data.parameters && data.parameters.temperature) {
                    var max:number = NaN;
                    var min:number = NaN;
                    if (jj < data.parameters.temperature[0].value.length) {
                        max = data.parameters.temperature[0].value[jj];
                    }
                    if (jj < data.parameters.temperature[1].value.length) {
                        min = data.parameters.temperature[1].value[jj];
                    }
                    jj++;
                    cell3.innerHTML = "";
                    if (!isNaN(max)) {
                        cell3.innerHTML += max.toString();
                    }
                    if (!isNaN(min)) {
                        if (cell3.innerHTML) {
                            cell3.innerHTML += "&nbsp;/&nbsp;"
                        }
                        cell3.innerHTML += min.toString();
                    }
                }
            }
            /*
            data.parameters.temperature[0].value
(7) [80, 79, 74, 72, 75, 75, 75]
data.parameters.temperature[1].value
(6) [69, 65, 56, 54, 56, 54]
            */
            //debugger;
        }
    }
}
