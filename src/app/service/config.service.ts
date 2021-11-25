import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export class Config {
    rootUrl!: string;
    constructor() {

    }
}
export const appConfig = new Config();

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    constructor(private http: HttpClient) {

    }

    loadAppConfig(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.http.get<Config>("./assets/config.json").subscribe(
                (c: Config) => {
                    appConfig.rootUrl = c.rootUrl;
                    resolve(true);
                }
            );
        });
    }
}
