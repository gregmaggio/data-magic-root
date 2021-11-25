import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class DWMLService {
    constructor(private http: HttpClient) {

    }

    load(latitude:number, longitude:number, unit:string):Observable<string> {
        var intUnit:number = 0;
        if (unit == "m") {
            intUnit = 1;
        }
        var uri: string = "https://forecast.weather.gov/MapClick.php?lat=" + latitude.toString() + "&lon=" + longitude.toString() + "&unit=" + intUnit.toString() + "&lg=english&FcstType=dwml";
        return this.http.get(uri, { responseType: 'text' });
    }
}
