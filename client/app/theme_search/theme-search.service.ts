import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Theme} from "../models/theme";

@Injectable()
export class ThemeSearchService {
    constructor(private http: Http) { }

    searchThemes(searchTerm: string) {
        console.log(searchTerm);
        return this.http.get('http://localhost:3000/api/themes/' + searchTerm)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}