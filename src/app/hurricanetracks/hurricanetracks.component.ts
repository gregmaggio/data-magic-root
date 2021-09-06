import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { DeviceDetectorService } from "ngx-device-detector";
import { Observable, of } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { BaseComponent } from "../base.component";
import { Basin, HurricaneService, Storm, StormTrack } from "../service/hurricane.service";
import { secureConfig } from "../service/secure.service";

const INITIAL_VIEW_STATE = { latitude: 37.0204489, longitude: -109.4589183, zoom: 4.5, pitch: 0 };

@Component({
    selector: 'app-hurricanetracks',
    templateUrl: './hurricanetracks.component.html',
    styleUrls: ['./hurricanetracks.component.css']
  })
  export class HurricaneTracksComponent extends BaseComponent implements OnInit, AfterViewInit {
    static component:HurricaneTracksComponent;
    service!:HurricaneService;
    basins!:Basin[];
    years!:number[];
    storms!:Storm[];
    stormTracks!:StormTrack[];
    selectedBasin!:Basin;
    selectedYear!:number;
    selectedStorm!:Storm;
    apiLoaded: Observable<boolean>;
    zoom = 5;
    center!: google.maps.LatLngLiteral;
    options: google.maps.MapOptions = {
        mapTypeId: 'hybrid',
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        maxZoom: 15,
        minZoom: 1,
    };
    markers!:any[];
    infoContent!:string;
    @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

    constructor(protected http: HttpClient, protected deviceService: DeviceDetectorService, private ngZone: NgZone) {
        super(http, deviceService);
        HurricaneTracksComponent.component = this;
        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          });
        this.service = new HurricaneService(http);
        this.apiLoaded = http.jsonp('https://maps.googleapis.com/maps/api/js?key=' + secureConfig.googleMapsKey, 'callback')
            .pipe(
                map(() => true),
                catchError(() => of(false)),
            );
    }

    ngOnInit() {
        this.loadBasins();
    }

    ngAfterViewInit() {        

    }

    tilesloaded(eventObj: any) {
        
    }

    loadBasins() {
        this.setLoading(true);
        this.service.basins().subscribe(
            (basins:Basin[]) => {
                this.setLoading(false);
                this.basins = basins;
                window.setTimeout(this.basinChange, 500);
            }
        );
    }

    loadYears() {
        this.setLoading(true);
        this.service.years(this.selectedBasin.name).subscribe(
            (years:number[]) => {
                this.setLoading(false);
                this.years = years.reverse();
                window.setTimeout(this.yearChange, 500);
            }
        );
    }

    loadStorms() {
        this.setLoading(true);
        this.service.storms(this.selectedBasin.name, this.selectedYear).subscribe(
            (storms:Storm[]) => {
                this.setLoading(false);
                this.storms = storms;
                window.setTimeout(this.stormChange, 500);
            }
        );
    }

    loadStormTracks() {
        this.setLoading(true);
        this.service.stormTracks(this.selectedBasin.name, this.selectedYear, this.selectedStorm.stormNo).subscribe(
            (stormTracks:StormTrack[]) => {
                this.setLoading(false);
                this.stormTracks = stormTracks;
                var centerLat:number = 0;
                var centerLon:number = 0;
                for (var ii:number = 0; ii < stormTracks.length; ii++) {
                    this.addMarker(stormTracks[ii]);
                    centerLat += stormTracks[ii].latitude;
                    centerLon += stormTracks[ii].longitude;
                }
                centerLat /= stormTracks.length;
                centerLon /= stormTracks.length;
                var center: google.maps.LatLng = new google.maps.LatLng(centerLat, centerLon);
                this.map.panTo(center)
            }
        );
    }

    addMarker(stormTrack: StormTrack) {
        var marker:any = {
          position: {
            lat: stormTrack.latitude,
            lng: stormTrack.longitude,
          },
          title: stormTrack.status,
          options: {
              clickable: true,
              draggable: false
          },
          info: this.getInfoWindowContent(stormTrack)
        };
        this.markers.push(marker);
    }

    getInfoWindowContent(stormTrack: StormTrack) {
        var year = stormTrack.year.toString();
		var month = stormTrack.month.toString();
		var day = stormTrack.day.toString();
		var hours = stormTrack.hours.toString();
		var minutes = stormTrack.minutes.toString();
		if (month.length < 2) {
			month = "0" + month;
		}
		if (day.length < 2) {
			day = "0" + day;
		}
		if (hours.length < 2) {
			hours = "0" + hours;
		}
		if (minutes.length < 2) {
			minutes = "0" + minutes;
		}
		var message = "";
		message += "Date/Time: " + year + "-" + month + "-" + day + " " + hours + ":" + minutes + "<br />";
		message += "Name: " + stormTrack.stormName + "<br />";
		message += "Status: " + stormTrack.status + "<br />";
		message += "Wind Speed: " + stormTrack.maxWindSpeed.toString() + "<br />";
		if (stormTrack.minPressure != -999) {
			message += "Pressure: " + stormTrack.minPressure.toString();
		}
        return message;
    }

    openInfo(marker: MapMarker, content:string) {
        this.infoContent = content;
        this.infoWindow.position = marker.position;
        this.infoWindow.open();
    }

    basinChange(eventObj:any) {
        var basin:HTMLSelectElement = <HTMLSelectElement>document.getElementById('basin');
        if (basin.selectedIndex > -1) {
            var component = HurricaneTracksComponent.component;
            component.selectedBasin = component.basins[basin.selectedIndex];
            component.years = [];
            component.storms = [];
            component.stormTracks = [];
            component.markers = [];
            component.selectedYear = Number.NaN;
            component.selectedStorm = {} as any;            
            component.loadYears();
        }
    }

    yearChange(eventObj:any) {
        var year:HTMLSelectElement = <HTMLSelectElement>document.getElementById('year');
        if (year.selectedIndex > -1) {
            var component = HurricaneTracksComponent.component;
            component.selectedYear = component.years[year.selectedIndex];
            component.storms = [];
            component.stormTracks = [];
            component.markers = [];
            component.selectedStorm = {} as any;
            component.loadStorms();
        }
    }

    stormChange(eventObj:any) {
        var storm:HTMLSelectElement = <HTMLSelectElement>document.getElementById('storm');
        if (storm.selectedIndex > -1) {
            var component = HurricaneTracksComponent.component;
            component.selectedStorm = component.storms[storm.selectedIndex];
            component.stormTracks = [];
            component.markers = [];
            component.loadStormTracks();
        }
    }
  }
