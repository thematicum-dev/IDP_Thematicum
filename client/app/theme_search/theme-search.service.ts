import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";

@Injectable()
export class ThemeSearchService {
    constructor(private http: Http) { }

    searchThemes(searchTerm: string) {
        return this.http.get('http://localhost:3000/api/themes/' + searchTerm)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}