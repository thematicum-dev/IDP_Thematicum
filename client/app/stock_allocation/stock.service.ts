import {Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AutocompleteDatasourceInterface} from "../autocomplete/autocomplete-datasource-interface";

@Injectable()
export class StockService implements AutocompleteDatasourceInterface {
    constructor(private http: Http) {
    }

    getAutocompleteList() {
        return this.http.get('http://localhost:3000/api/stocks')
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}