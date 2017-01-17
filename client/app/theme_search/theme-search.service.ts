import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Theme} from "../models/theme";
import {ErrorService} from "../error-handling/error.service";

@Injectable()
export class ThemeSearchService {
    constructor(private http: Http, private errorService: ErrorService) { }

    baseAPI: string = 'http://localhost:3000/api/';

    //TODO: delegate to avoid duplicate code
    /*
        e.g. apiCall(apiPath: string): Observable<any> {}
     */
    searchThemes(searchTerm: string) {
        let searchQuery = searchTerm ? "&searchQuery=" + searchTerm : '';
        let apiPath = this.baseAPI + 'themes' + this.setTokenQueryParam() + searchQuery;

        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    getThemeById(id: string) {
        console.log('getThemeById: ', id)
        let apiPath = this.baseAPI + 'themes/' + id + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                //console.log('Response: ', response)
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemeProperties(themeId: string) {
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemePropertiesByUser(themeId: string) {
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId + '/user' +  this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                return this.errorService.handleError(error);
                //return Observable.throw(error.json())
            });
    }

    //TODO: delete
    getUserInputsPerTheme(themeId: string) {
        let apiPath = 'http://localhost:3000/api/themes/userinputs/' + themeId + this.setTokenQueryParam();

        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    setTokenQueryParam() {
        return localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    }
}