import {User} from "../models/user";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {SignupModel} from "./signup-model";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
    constructor(private http: Http, private router: Router) {}

    signup(signupModel: SignupModel) {
        const body = JSON.stringify(signupModel);
        const headers = new Headers({'Content-Type': 'application/json'});

        console.log(body);
        return this.http.post('http://localhost:3000/auth', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});

        return this.http.post('http://localhost:3000/auth/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) =>  Observable.throw(error.json()));
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/']);
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    getLoggedInUser() {
        return localStorage.getItem('username');
    }
}