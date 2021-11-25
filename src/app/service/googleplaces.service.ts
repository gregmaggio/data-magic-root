import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prediction {
    placeId: string;
    description: string;
}

export interface AddressComponent {
    longName: string;
    shortName: string;
    types: string[];
}

export interface Place {
    placeId: string;
    name: string;
    latitude: number;
    longtitude: number;
    addressComponents: AddressComponent[];
}

export class GooglePlacesService {
    constructor(private http: HttpClient) {

    }

    predictions(searchText:string): Observable<Prediction[]> {
        var uri: string = "https://datamagic.ca/GooglePlaces/api/autoComplete/" + encodeURIComponent(searchText);
        return this.http.get<Prediction[]>(uri);
    }

    place(placeId:string):Observable<Place> {
        var uri: string = "https://datamagic.ca/GooglePlaces/api/place/" + encodeURIComponent(placeId);
        return this.http.get<Place>(uri);
    }
}
