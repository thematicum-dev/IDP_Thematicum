import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {StockModel} from "../models/stockModel";
import {ErrorService} from "../error_handling/error.service";
import {StockServiceInterface} from "./stock-service-interface";
import * as Settings from '../utilities/settings';

@Injectable()
export class StockService implements StockServiceInterface{

    constructor(private http: Http, private errorService: ErrorService) {}
    baseAPI: string = Settings.getBaseApi();
    headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')});

    createStock(stock: StockModel) {
        const body = JSON.stringify(stock);
        let apiPath = this.baseAPI + 'stocks/';
        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    updateStock(stock: StockModel) {
        const body = JSON.stringify(stock);
        let apiPath = this.baseAPI + 'stocks/';
        return this.http.put(apiPath, body, { headers: this.headers })
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }
    
    handleError = (error: Response) => {
        this.errorService.handleError(error);
        return Observable.throw(error.json());
    }
}