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

@Injectable()
export class ThemeService {
    constructor(private http: Http, private errorService: ErrorService) {}
    baseAPI: string = 'http://localhost:3000/api/';
    headers = new Headers({'Content-Type': 'application/json'});

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
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    createUserThemeImput(themeId: any, themeProperties: ThemeProperties) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/theme/' + themeId + this.setTokenQueryParam();

        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    updateUserThemeInput(userThemeInputId: any, themeProperties: ThemeProperties) {
        const body = JSON.stringify(themeProperties);
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId + this.setTokenQueryParam();

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    deleteUserThemeInput(userThemeInputId: string) {
        console.log('Service theme input id: ', userThemeInputId)
        let apiPath = this.baseAPI + 'themeproperties/' + userThemeInputId + this.setTokenQueryParam();
        return this.http.delete(apiPath)
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    updateTheme(theme: Theme) {
        const body = JSON.stringify(theme);
        let apiPath = this.baseAPI + 'themes/' + theme._id + this.setTokenQueryParam();

        return this.http.put(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch((error: Response) =>  Observable.throw(error.json()));
    }
}