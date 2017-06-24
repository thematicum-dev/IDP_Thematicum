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
    
    signup(signupModel: SignupModel, captcha: String) {
        const body = JSON.stringify({
	        user: signupModel,
		    response: captcha	        
        });
        let apiPath = this.baseAPI + 'auth/signup';
        return this.http.post(apiPath, body, {headers: this.contentTypeHeaders})
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    signin(user: UserModel, captcha: String) {
	    console.log("signin pressed");
        const body = JSON.stringify({
	        user: user,
		    response: captcha	        
        });
        let apiPath = this.baseAPI + 'auth/signin';

        return this.http.post(apiPath, body, {headers: this.contentTypeHeaders})
            .map((response: Response) => {
		console.log("sigin in successful, redirecting to URL after login");
                this.redirectToUrlAfterLogin();
                return response.json();
            })
            .catch(this.handleError);
    }

    logout() {
	    console.log("logout pressed");
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

    getLoggedInUserEmail(){
        return localStorage.getItem('email');
    }

    getStoredToken() {
        return localStorage.getItem('token');
    }

    redirectToUrlAfterLogin() {
	    console.log("redirectURL", this.redirectUrl);
	    console.log("redirectURL == null", this.redirectUrl == null);
	    console.log("redirectURL == undefined", this.redirectUrl == undefined);
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
	console.log("navigating to this.redirectURL");
        } else {
            this.router.navigate(['/home']);
	console.log("navigating to home");
        }
    }

    handleError = (error: Response) => {
        this.errorService.handleError(error);
        return Observable.throw(error.json());
    }
}