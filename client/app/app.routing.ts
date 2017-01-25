import {Routes, RouterModule} from "@angular/router";
import {HomepageComponent} from "./navigation/homepage.component";
import {AboutComponent} from "./static_pages/about.component";
import {SignupComponent} from "./auth/signup.component";
import {SigninComponent} from "./auth/signin.component";
import {ThemeSearchComponent} from "./theme_search/theme-search.component";
import {ThemeCreationComponent} from "./theme_creation/theme-creation.component";
import {ThemeDetailsComponent} from "./theme_details/theme-details.component";
import {AuthGuard} from "./auth/auth-guard.service";
import {UserProfileComponent} from "./user_profile/user-profile.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'about', component: AboutComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'search', component: ThemeSearchComponent, canActivate: [AuthGuard] },
    { path: 'theme/create', component: ThemeCreationComponent },
    { path: 'theme/:id', component: ThemeDetailsComponent },
    { path: 'profile', component: UserProfileComponent},
    { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(APP_ROUTES);