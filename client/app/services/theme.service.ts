import {User} from "../models/user";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {ThemeCreationModel} from "../models/themeCreationModel";
import {ThemeProperties} from "../models/themeProperties";
import {Theme} from "../models/theme";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {ErrorService} from "../error-handling/error.service";
import * as Settings from '../utilities/settings';

@Injectable()
export class ThemeService {
    constructor(private http: Http, private errorService: ErrorService) {}
    baseAPI: string = Settings.getBaseApi();
    headers = new Headers({'Content-Type': 'application/json'});

    //TODO: delegate/refactor
    /*
     e.g. apiCall(apiPath: string): Observable<any> {}
     */

    setTokenQueryParam() {
        return localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    }

    createTheme(theme: Theme) {
        const body = JSON.stringify(theme);
        let apiPath = this.baseAPI + 'themes/' + this.setTokenQueryParam();
        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    createManyStockCompositionsAndAllocations(themeId: any, stockAllocation: StockAllocationModel[]) {
        const stockAllocationBody = {stockAllocation: stockAllocation};
        const body = JSON.stringify(stockAllocationBody);
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId + this.setTokenQueryParam();

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    createUserThemeImput(themeId: any, themeProperties: ThemeProperties) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId + this.setTokenQueryParam();

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    updateUserThemeInput(userThemeInputId: any, themeProperties: ThemeProperties) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId + this.setTokenQueryParam();

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    deleteUserThemeInput(userThemeInputId: string) {
        console.log('Service theme input id: ', userThemeInputId)
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId + this.setTokenQueryParam();
        return this.http.delete(apiPath)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    updateTheme(theme: Theme) {
        const body = JSON.stringify(theme);
        let apiPath = this.baseAPI + 'themes/' + theme._id + this.setTokenQueryParam();

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    searchThemes(searchTerm: string) {
        let searchQuery = searchTerm ? "&searchQuery=" + searchTerm : '';
        let apiPath = this.baseAPI + 'themes' + this.setTokenQueryParam() + searchQuery;

        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemeById(id: string) {
        console.log('getThemeById: ', id)
        let apiPath = this.baseAPI + 'themes/' + id + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
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

    getThemeStockAllocationDistribution(themeId: string) {
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                console.log(error)
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    updateUserStockAllocation(allocationId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId + this.setTokenQueryParam();
        const body = {exposure: exposure};

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }

    createUserStockAllocation(themeStockCompositionId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/themestockcomposition/' + themeStockCompositionId + this.setTokenQueryParam();
        const body = {exposure: exposure};

        return this.http.post(apiPath, body, this.headers)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }

    deleteUserStockAllocation(allocationId: string) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId + this.setTokenQueryParam();
        return this.http.delete(apiPath)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }

    deleteTheme(themeId: string) {
        let apiPath = this.baseAPI + 'themes/' + themeId + this.setTokenQueryParam();
        return this.http.delete(apiPath)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }
}