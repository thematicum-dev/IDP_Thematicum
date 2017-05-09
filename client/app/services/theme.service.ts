import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {ThemePropertiesEditModel} from "../models/themePropertiesEditModel";
import {Theme} from "../models/theme";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {ErrorService} from "../error_handling/error.service";
import * as Settings from '../utilities/settings';
import {ThemeServiceInterface} from "./theme-service-interface";

@Injectable()
export class ThemeService implements ThemeServiceInterface{
    //TODO: refactor, make service more abstract/modular
    constructor(private http: Http, private errorService: ErrorService) {}
    baseAPI: string = Settings.getBaseApi();
    headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')});

    createTheme(theme: Theme) {
        const body = JSON.stringify(theme);
        let apiPath = this.baseAPI + 'themes/';
        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    createManyStockCompositionsAndAllocations(themeId: any, stockAllocation: StockAllocationModel[]) {
        const stockAllocationBody = {stockAllocation: stockAllocation};
        const body = JSON.stringify(stockAllocationBody);
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId;

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    createUserThemeInput(themeId: any, themeProperties: ThemePropertiesEditModel) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId;

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    updateUserThemeInput(userThemeInputId: any, themeProperties: ThemePropertiesEditModel) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId;

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    deleteUserThemeInput(userThemeInputId: string) {
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId;
        return this.http.delete(apiPath, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    updateTheme(theme: Theme) {
        const body = JSON.stringify(theme);
        let apiPath = this.baseAPI + 'themes/' + theme._id;

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    encodeQueryData(data: any) {
        let ret = [];
        for (let d in data)
            if(typeof data[d] !== 'undefined' && data[d] !== null)
                ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return "?" + ret.join('&');
    }

    searchThemes(searchTerm: string, categories: number[] = [], maturity: number[] = [], timeHorizon: number[] = [], tags: string[] = []) {        
        let start: number = 1;
        let params = {'searchQuery': searchTerm, 'start': start, 'categories': categories, 'maturity': maturity, 'timeHorizon': timeHorizon, 'tags': tags};
        let searchQuery = this.encodeQueryData(params);
        let apiPath = this.baseAPI + 'themes' + searchQuery;
        
        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    getThemeById(id: string) {
        let apiPath = this.baseAPI + 'themes/' + id;
        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    getThemeProperties(themeId: string) {
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId;
        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    getThemeStockAllocationDistribution(themeId: string) {
        let apiPath = this.baseAPI + 'stockallocations/theme/' + themeId;
        return this.http.get(apiPath, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    updateUserStockAllocation(allocationId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId;
        const body = {exposure: exposure};

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    createUserStockAllocation(themeStockCompositionId: string, exposure: number) {
        let apiPath = this.baseAPI + 'stockallocations/themestockcomposition/' + themeStockCompositionId;
        const body = {exposure: exposure};

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    deleteUserStockAllocation(allocationId: string) {
        let apiPath = this.baseAPI + 'stockallocations/' + allocationId;
        return this.http.delete(apiPath, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    deleteTheme(themeId: string) {
        let apiPath = this.baseAPI + 'themes/' + themeId;
        return this.http.delete(apiPath, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    handleError = (error: Response) => {
        this.errorService.handleError(error);
        return Observable.throw(error.json());
    }
}