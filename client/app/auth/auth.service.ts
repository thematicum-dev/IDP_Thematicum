import {User} from "../models/user";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {SignupModel} from "./signup-model";
import {Router} from "@angular/router";
import {ErrorService} from "../error-handling/error.service";

@Injectable()
export class AuthService {
    redirectUrl: string;

    constructor(private http: Http, private router: Router, private errorService: ErrorService) {}

    signup(signupModel: SignupModel) {
        const body = JSON.stringify(signupModel);
        const headers = new Headers({'Content-Type': 'application/json'});

        console.log(body);
        return this.http.post('http://localhost:3000/auth', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.post('http://localhost:3000/auth/signin', body, {headers: headers})
            .map((response: Response) => {
                this.redirectToUrlAfterLogin();
                return response.json()
            })
            .catch((error: Response) =>  {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/']);
    }

    isLoggedIn(): Observable<boolean> {
        var token = this.getStoredToken();
        if (token == null) {
            console.log('Null token')
            return Observable.of(false);
        }

        const token = '?token=' + token;

        return this.http.get('http://localhost:3000/auth/isAuthenticated' + token)
            .map((response: Response) => {
                    console.log('Response for authentication: ', status==200)
                    console.log(response)
                    return Observable.of(response.status == 200);
                }
            )
            .catch((error: Response) =>  {
                console.log('Error in authentication')
                console.log(error)
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
            console.log('am i even inside this')
            this.router.navigate([this.redirectUrl]);
        }
    }
}