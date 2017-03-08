import {Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ErrorService} from "../error-handling/error.service";

@Injectable()
export class AutocompleteDatasourceService {
    constructor(private http: Http, private errorService: ErrorService) {}
    getAutocompleteList(apiPath: string) {
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }
}