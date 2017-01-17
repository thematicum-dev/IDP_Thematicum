import {User} from "../models/user";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {ThemeCreationModel} from "../models/themeCreationModel";
import {ThemeProperties} from "../models/themeProperties";

@Injectable()
export class ThemeService {
    constructor(private http: Http) {}
    baseAPI: string = 'http://localhost:3000/api/';
    headers = new Headers({'Content-Type': 'application/json'});

    setTokenQueryParam() {
        return localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    }

    createTheme(themeCreationModel: ThemeCreationModel) {
        const body = JSON.stringify(themeCreationModel);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const headers = new Headers({'Content-Type': 'application/json'});

        //TODO: don't stringify static data (e.g. theme property values)
        //console.log(body);
        return this.http.post('http://localhost:3000/api/themes' + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    createUserThemeImput(themeId: any, themeProperties: ThemeProperties) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId + this.setTokenQueryParam();

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    updateUserThemeInput(userThemeInputId: any, themeProperties: ThemeProperties) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId + this.setTokenQueryParam();

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    deleteUserThemeInput(userThemeInputId: string) {
        console.log('Service theme input id: ', userThemeInputId)
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId + this.setTokenQueryParam();
        return this.http.delete(apiPath)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
        //return Observable.of('test');
    }
}