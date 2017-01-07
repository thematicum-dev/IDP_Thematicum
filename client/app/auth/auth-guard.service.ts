import { Injectable }     from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot}    from '@angular/router';
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        console.log(url)

        return this.authService.isLoggedIn().map(e => {
            if (e) {
                return true;
            } else {
                this.navigateToLogin(url);
                return Observable.of(false);
            }
        }).catch(() => {
            this.navigateToLogin(url);
            return Observable.of(false);
        });
    }

    navigateToLogin(url: string) {
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;

        this.router.navigate(['/signin']);
    }
}