import {Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AutocompleteDatasourceService} from "../autocomplete/autocomplete-datasource.service";

@Injectable()
export class ThemeTagsService implements AutocompleteDatasourceService {
    constructor(private http: Http) {
    }

    getAutocompleteList() {
        let apiPath = 'http://localhost:3000/api/themes/tags' + '?token=' + localStorage.getItem('token');
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}