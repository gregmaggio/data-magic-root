import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class DiscussionService {
    static discussionStart:string = "<pre class=\"glossaryProduct\">";
    static discussionEnd:string = "</pre>";

    constructor(private http: HttpClient) {

    }

    load(wfo:string):Observable<string> {
        var uri: string = "https://forecast.weather.gov/product.php?site=" + wfo + "&issuedby=" + wfo + "&product=AFD&format=txt&version=1&glossary=0";
        return this.http.get(uri, { responseType: 'text' });
    }
}
