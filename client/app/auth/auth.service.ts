import {User} from "../models/user";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {SignupModel} from "./signup-model";
import {Router} from "@angular/router";
import {ErrorService} from "../error-handling/error.service";
import * as Settings from '../utilities/settings';

@Injectable()
export class AuthService {
    baseAPI: string = Settings.getBaseApi();
    headers = new Headers({'Content-Type': 'application/json'});
    redirectUrl: string;
    constructor(private http: Http, private router: Router, private errorService: ErrorService) {}

    setTokenQueryParam() {
        return localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    }
    
    signup(signupModel: SignupModel) {
        const body = JSON.stringify(signupModel);

        let apiPath = this.baseAPI + 'auth/signup';
        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json())
            });
    }

    signin(user: User) {
        const body = JSON.stringify(user);

        let apiPath = this.baseAPI + 'auth/signin';
        return this.http.post(apiPath, body, {headers: this.headers})
            .map((response: Response) => {
                this.redirectToUrlAfterLogin();
                return response.json();
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error);
                return Observable.throw(error.json());
            });
    }

    logout() {
        localStorage.clear();
        this.redirectUrl = null;
        this.router.navigate(['/']);
    }

    isLoggedIn(): Observable<boolean> {
        var token = this.getStoredToken();
        if (!token) {
            return Observable.of(false);
        }

        let apiPath = this.baseAPI + 'auth/isAuthenticated' + this.setTokenQueryParam();
        return this.http.get(apiPath)
            .map((response: Response) => {
                    return Observable.of(response.status == 200);
                }
            )
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
}