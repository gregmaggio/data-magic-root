import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class TimeZoneService {
    constructor(private http: HttpClient) {

    }

    timeZone(latitude:number, longitude:number): Observable<string> {        
        var uri: string = "https://datamagic.ca/TimeZone/api/" + latitude + "/" + longitude + "/timeZone";
        return this.http.get<string>(uri);
    }
}