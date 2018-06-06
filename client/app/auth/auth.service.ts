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
                localStorage.setItem('token', response.json().token);
                localStorage.setItem('username', response.json().username);
                localStorage.setItem('email', response.json().email);
                localStorage.setItem('datejoined', response.json().datejoined);
                localStorage.setItem('isAdmin', response.json().isAdmin);
                this.redirectToUrlAfterLogin();
                return response.json();
            })
            .catch(this.handleError);
    }

    forgot(user: UserModel) {
        console.log("Forgot Password pressed");

        const body = JSON.stringify({
            user: user        
        });

        let apiPath = this.baseAPI + 'auth/forgot';

        return this.http.post(apiPath, body, {headers: this.contentTypeHeaders})
            .map((response: Response) => {
                console.log("Reset message being sent to the email.");
                return response.json();
            })
            .catch(this.handleError);
    }

    reset(user: UserModel, token: String) {

        console.log("Reset Password pressed");

        const body = JSON.stringify({
            user: user,
            token: token        
        });

        let apiPath = this.baseAPI + 'auth/reset';

        return this.http.post(apiPath, body, {headers: this.contentTypeHeaders})
            .map((response: Response) => {
                console.log("Reset action being implemented");
                return response.json();
            })
            .catch(this.handleError);

    }

    deleteLocalStorage(){
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('datejoined');
        localStorage.removeItem('isAdmin');
    }

    logout() {        
        this.deleteLocalStorage();
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
            .map((response: Response) => {
                console.log(response);
               Observable.of(response.status == 200)
               return response.status == 200;
            })
            .catch(this.handleError);
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

    getLoggedInUserDateJoined(){
        return localStorage.getItem('datejoined');
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
        this.deleteLocalStorage();
        this.errorService.handleError(error);
        return Observable.throw(error.json());
    }
}