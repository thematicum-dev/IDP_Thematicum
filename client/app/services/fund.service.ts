import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {ErrorService} from "../error_handling/error.service";
import * as Settings from '../utilities/settings';
import {FundServiceInterface} from "./fund-service-interface";
import {FundModel} from "../models/fundModel";

@Injectable()
export class FundService implements FundServiceInterface{

    constructor(private http: Http, private errorService: ErrorService) {}
    baseAPI: string = Settings.getBaseApi();
    headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')});

    createFund(fund: FundModel) {
        const body = JSON.stringify(fund);
        let apiPath = this.baseAPI + 'funds/';
        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    updateFund(fund: FundModel) {
        const body = JSON.stringify(fund);
        let apiPath = this.baseAPI + 'funds/';
        return this.http.put(apiPath, body, { headers: this.headers })
            .map((response: Response) => response.json().obj)
            .catch(this.handleError);
    }

    deleteFund(fund: FundModel) {
        const body = JSON.stringify(fund);
        let apiPath = this.baseAPI + 'funds/' + fund._id;
        this.http.delete(apiPath);
        return this.http.delete(apiPath, { headers: this.headers })
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    handleError = (error: Response) => {
        this.errorService.handleError(error);
        return Observable.throw(error.json());
    }
}