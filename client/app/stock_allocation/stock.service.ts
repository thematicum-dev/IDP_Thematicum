import {Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AutocompleteDatasourceService} from "../autocomplete/autocomplete-datasource.service";

@Injectable()
export class StockService implements AutocompleteDatasourceService {
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