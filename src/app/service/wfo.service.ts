import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WFO {
    wfo: string;
    cwa: string;
    region: string;
    fullStationId: string;
    cityState: string;
    city: string;
    state: string;
    stateAbbreviation: string;
    radar: string;
    latitude: number;
    longitude: number;
}

export class WFOService {
    constructor(private http: HttpClient) {

    }

    contains(latitude:number, longitude:number): Observable<WFO> {        
        var uri: string = "https://datamagic.ca/WFO/api/" + latitude + "/" + longitude + "/coordinates";
        return this.http.get<WFO>(uri);
    }

    read(id:string): Observable<WFO> {        
        var uri: string = "https://datamagic.ca/WFO/api/" + id;
        return this.http.get<WFO>(uri);
    }

    list(): Observable<WFO[]> {        
        var uri: string = "https://datamagic.ca/WFO/api/list";
        return this.http.get<WFO[]>(uri);
    }
}
