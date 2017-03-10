import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {ThemePropertiesEditModel} from "../models/themePropertiesEditModel";
import {Theme} from "../models/theme";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {ErrorService} from "../error_handling/error.service";
import * as Settings from '../utilities/settings';

@Injectable()
export class ThemeService {
    constructor(private http: Http, private errorService: ErrorService) {}
    baseAPI: string = Settings.getBaseApi();
    headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')});

    //TODO: delegate/refactor
    /*
     e.g. apiCall(apiPath: string): Observable<any> {}
     */

    createTheme(theme: Theme) {
        const body = JSON.stringify(theme);
        let apiPath = this.baseAPI + 'themes/';
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
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId;

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    createUserThemeInput(themeId: any, themeProperties: ThemePropertiesEditModel) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId;

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    updateUserThemeInput(userThemeInputId: any, themeProperties: ThemePropertiesEditModel) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId;

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    deleteUserThemeInput(userThemeInputId: string) {
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId;
        return this.http.delete(apiPath, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    updateTheme(theme: Theme) {
        const body = JSON.stringify(theme);
        let apiPath = this.baseAPI + 'themes/' + theme._id;

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    searchThemes(searchTerm: string) {
        let searchQuery = searchTerm ? "?searchQuery=" + searchTerm : '';
        let apiPath = this.baseAPI + 'themes' + searchQuery;

        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemeById(id: string) {
        let apiPath = this.baseAPI + 'themes/' + id;
        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemeProperties(themeId: string) {
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId;
        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    getThemeStockAllocationDistribution(themeId: string) {
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId;
        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    updateUserStockAllocation(allocationId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId;
        const body = {exposure: exposure};

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }

    createUserStockAllocation(themeStockCompositionId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/themestockcomposition/' + themeStockCompositionId;
        const body = {exposure: exposure};

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }

    deleteUserStockAllocation(allocationId: string) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId;
        return this.http.delete(apiPath, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }

    deleteTheme(themeId: string) {
        let apiPath = this.baseAPI + 'themes/' + themeId;
        return this.http.delete(apiPath, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }
}