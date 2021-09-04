import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Basin {
    name: string;
    description: string;
    centerX: number;
    centerY: number;
}

export interface Storm {
    stormNo: number;
    stormName: string;
    tracks: number;
}

export interface StormTrack {
    stormNo: number;
    stormName: string;
    trackNo: number;
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    latitude: number;
    longitude: number;
    maxWindSpeed: number;
    minPressure: number;
    status: string;
}

export interface StormKey {
    stormKey: string;
    basin: string;
    year: number;
    stormNo: number;
    stormName: string;
}

export class HurricaneService {
    constructor(private http: HttpClient) {

    }

    basins(): Observable<Basin[]> {        
        var uri: string = "https://datamagic.ca/Hurricane/api/basins";
        return this.http.get<Basin[]>(uri);
    }

    years(basin:string): Observable<number[]> {        
        var uri: string = "https://datamagic.ca/Hurricane/api/basin/" + basin + "/years";
        return this.http.get<number[]>(uri);
    }
    
    storms(basin:string, year:number): Observable<Storm[]> {        
        var uri: string = "https://datamagic.ca/Hurricane/api/storm/" + basin + "/" + year.toString();
        return this.http.get<Storm[]>(uri);
    }

    stormTracks(basin:string, year:number, stormNo:number): Observable<StormTrack[]> {        
        var uri: string = "https://datamagic.ca/Hurricane/api/stormTrack/" + basin + "/" + year.toString() + "/" + stormNo.toString();
        return this.http.get<StormTrack[]>(uri);
    }

    search(searchText:string): Observable<StormKey[]> {        
        var uri: string = "https://datamagic.ca/Hurricane/api/search/" + searchText;
        return this.http.get<StormKey[]>(uri);
    }
}