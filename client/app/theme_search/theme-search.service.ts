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
    headers = new Headers({'Content-Type': 'application/json'});

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

    getThemeStockCompositions(themeId: string) {
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId + '/themestockcompositions' + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                console.log(error)
                //return this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemeStockAllocationDistribution(themeId: string) {
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                console.log(error)
                //return this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemeStockAllocationByUser(themeId: string) {
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId + '/user' + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                console.log(error)
                //return this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    updateUserStockAllocation(allocationId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId + this.setTokenQueryParam();
        const body = {exposure: exposure};

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    createUserStockAllocation(themeStockCompositionId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/themestockcomposition/' + themeStockCompositionId + this.setTokenQueryParam();
        const body = {exposure: exposure};

        return this.http.post(apiPath, body, this.headers)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    deleteUserStockAllocation(allocationId: string) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId + this.setTokenQueryParam();
        return this.http.delete(apiPath)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    setTokenQueryParam() {
        return localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    }
}