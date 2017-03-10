import {UserModel} from "../models/userModel";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {SignupModel} from "./signup-model";
import {Router} from "@angular/router";
import {ErrorService} from "../error_handling/error.service";
import * as Settings from '../utilities/settings';
import {AuthServiceInterface} from "./auth-service-interface";

@Injectable()
export class AuthService implements AuthServiceInterface {
    baseAPI: string = Settings.getBaseApi();
    contentTypeHeaders = new Headers({'Content-Type': 'application/json'});
    redirectUrl: string;
    constructor(private http: Http, private router: Router, private errorService: ErrorService) {}
    
    signup(signupModel: SignupModel) {
        const body = JSON.stringify(signupModel);

        let apiPath = this.baseAPI + 'auth/signup';
        return this.http.post(apiPath, body, {headers: this.contentTypeHeaders})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    signin(user: UserModel) {
        const body = JSON.stringify(user);
        let apiPath = this.baseAPI + 'auth/signin';

        return this.http.post(apiPath, body, {headers: this.contentTypeHeaders})
            .map((response: Response) => {
                this.redirectToUrlAfterLogin();
                return response.json();
            })
            .catch(this.handleError);
    }

    logout() {
        localStorage.clear();
        this.redirectUrl = null;
        this.router.navigate(['/']);
    }

    isLoggedIn(): Observable<boolean> {
        const token = this.getStoredToken();
        if (!token) {
            return Observable.of(false);
        }

        const apiPath = this.baseAPI + 'auth/isAuthenticated';
        const authHeaders = new Headers({'Authorization': token});
        return this.http.get(apiPath, {headers: authHeaders})
            .map((response: Response) => Observable.of(response.status == 200))
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.of(false);
            });
    }

    getLoggedInUser() {
        return localStorage.getItem('username');
    }

    getStoredToken() {
        return localStorage.getItem('token');
    }

    redirectToUrlAfterLogin() {
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
        } else {
            this.router.navigate(['/home']);
        }
    }

    handleError = (error: Response) => {
        this.errorService.handleError(error);
        return Observable.throw(error.json());
    }
}