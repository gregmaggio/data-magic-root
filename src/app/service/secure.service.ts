import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class SecureConfig {
    googleMapsKey!: string;
    constructor() {

    }
}
export const secureConfig = new SecureConfig();

@Injectable({
    providedIn: 'root',
})
export class SecureService {
    constructor(private http: HttpClient) {

    }

    loadSecureConfig(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.http.get<SecureConfig>("./assets/secure.json").subscribe(
                (c: SecureConfig) => {
                    secureConfig.googleMapsKey = c.googleMapsKey;
                    resolve(true);
                }
            );
        });
    }
}
