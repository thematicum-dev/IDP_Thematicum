import {User} from "../models/user";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {ThemeCreationModel} from "../models/themeCreationModel";

@Injectable()
export class ThemeService {
    constructor(private http: Http) {}

    createTheme(themeCreationModel: ThemeCreationModel) {
        const body = JSON.stringify(themeCreationModel);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const headers = new Headers({'Content-Type': 'application/json'});

        console.log(body);
        return this.http.post('http://localhost:3000/api/themes' + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}