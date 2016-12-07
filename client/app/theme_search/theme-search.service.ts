import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Theme} from "../models/theme";

@Injectable()
export class ThemeSearchService {
    constructor(private http: Http) { }

    searchThemes(searchTerm: string) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';

        let searchQuery = searchTerm ? "&searchQuery=" + searchTerm : '';
        let apiPath = 'http://localhost:3000/api/themes' + token + searchQuery;

        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    getThemeById(id: string) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';

        return this.http.get('http://localhost:3000/api/themes/' + id + token)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    getUserInputsPerTheme(themeId: string) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';

        let apiPath = 'http://localhost:3000/api/themes/userinputs/' + themeId + token;

        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}