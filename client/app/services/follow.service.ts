import {UserModel} from "../models/userModel";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {ErrorService} from "../error_handling/error.service";
import {AuthService} from "../auth/auth.service";
import * as Settings from '../utilities/settings';

@Injectable()
export class FollowService {
    baseAPI: string = Settings.getBaseApi();
    contentTypeHeaders = new Headers({'Content-Type': 'application/json'});
    headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')});
    redirectUrl: string;
    constructor(private http: Http, private router: Router, private errorService: ErrorService, private authService: AuthService) {}

    getFollowMock(theme: string): boolean{
                return false;
    }

    encodeQueryData(data: any) {
        let ret = [];
        for (let d in data)
            if(typeof data[d] !== 'undefined' && data[d] !== null)
                ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return "?" + ret.join('&');
    }

    getFollow(theme: string){
            var email = this.authService.getLoggedInUserEmail();

            let params = {'email': email, 'theme': theme['_id']};
            let searchQuery = this.encodeQueryData(params);
            let apiPath = this.baseAPI + 'user/follow' + searchQuery;
            console.log(apiPath);


            return this.http.get(apiPath, {headers: this.headers})
                        .map((response: Response) => response.json())
                        .catch(this.handleError);
    }

    follow(theme: string){
            var email = this.authService.getLoggedInUserEmail();
            let params = {'email': email, 'themeId': theme['_id']};
            let apiPath = this.baseAPI + 'user/follow'
            console.log(apiPath);

            return this.http.post(apiPath,params, {headers: this.headers})
                        .map((response: Response) => response.json())
                        .catch(this.handleError);
    }

    unfollow(theme: string){
            var email = this.authService.getLoggedInUserEmail();

            let params = {'email': email, 'themeId': theme['_id']};
            let searchQuery = this.encodeQueryData(params);
            let apiPath = this.baseAPI + 'user/follow'
            console.log(apiPath);

            return this.http.delete(apiPath + searchQuery, {headers: this.headers})
                        .map((response: Response) => response.json())
                        .catch(this.handleError);
    }


    handleError = (error: any) => {
        this.errorService.handleError(error);
        return Observable.throw(error);
    }
}