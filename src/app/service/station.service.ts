import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Station {
    stationId: string;
    stationName: string;
    state: string;
    wfo: string;
    radar: string;
    latitude: number;
    longitude: number;
}

export class StationService {
    constructor(private http: HttpClient) {

    }

    nearest(latitude:number, longitude:number): Observable<Station> {        
        var uri: string = "https://datamagic.ca/Station/api/" + latitude + "/" + longitude + "/nearest";
        return this.http.get<Station>(uri);
    }

    read(id:string): Observable<Station> {        
        var uri: string = "https://datamagic.ca/Station/api/" + id;
        return this.http.get<Station>(uri);
    }

    list(): Observable<Station[]> {        
        var uri: string = "https://datamagic.ca/Station/api/list";
        return this.http.get<Station[]>(uri);
    }
}
