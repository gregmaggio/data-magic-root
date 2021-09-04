import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
    mailFrom: string;
    mailSubject: string;
    mailBody: string;
    recaptchaResponse: string;
}

export interface ContactResponse {
    invalidFields: string;
    captchaValid: boolean;
    sent: boolean;
}

export class ContactService {
    constructor(private http: HttpClient) {

    }

    send(request:ContactRequest): Observable<ContactResponse> {        
        var uri: string = "https://datamagic.ca/api/contact";
        var json = JSON.stringify(request);
        var headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        var httpOptions = {
            headers: headers,
            responseType: 'json' as 'json'
          };
        return this.http.post<ContactResponse>(uri, json, httpOptions);
    }
}
