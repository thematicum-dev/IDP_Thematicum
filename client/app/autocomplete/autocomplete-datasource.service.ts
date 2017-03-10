import {Http, Response, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ErrorService} from "../error_handling/error.service";

@Injectable()
export class AutocompleteDatasourceService {
    constructor(private http: Http, private errorService: ErrorService) {}
    getAutocompleteList(apiPath: string) {
        const headers = new Headers({'Authorization': localStorage.getItem('token')});
        return this.http.get(apiPath, {headers: headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }
}