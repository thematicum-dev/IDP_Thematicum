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

    createTheme(themeCreationModel: ThemeCreationModel) {
        const body = JSON.stringify(themeCreationModel);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const headers = new Headers({'Content-Type': 'application/json'});

        //TODO: don't stringify static data (e.g. theme property values)
        console.log(body);
        return this.http.post('http://localhost:3000/api/themes' + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    createUserThemeImput(themeId: any, themeProperties: ThemeProperties) {
        const body = JSON.stringify(themeProperties);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const themeId = themeId ? '&themeId=' + themeId : '';

        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.post('http://localhost:3000/api/userinputs' + token + themeId, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    updateUserThemeInput(userThemeInputId: any, themeProperties: ThemeProperties) {
        console.log(userThemeInputId)
        const body = JSON.stringify(themeProperties);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';

        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.put('http://localhost:3000/api/userinputs/' + userThemeInputId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}