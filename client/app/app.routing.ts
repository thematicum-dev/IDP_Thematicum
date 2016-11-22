import {Routes, RouterModule} from "@angular/router";
import {HomepageComponent} from "./navigation/homepage.component";
import {AboutComponent} from "./static_pages/about.component";
import {SignupComponent} from "./auth/signup.component";
import {SigninComponent} from "./auth/signin.component";
import {ThemeSearchComponent} from "./theme_search/theme-search.component";
import {ThemeCreationComponent} from "./theme_creation/theme-creation.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent },
    { path: 'about', component: AboutComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'search', component: ThemeSearchComponent },
    { path: 'theme/create', component: ThemeCreationComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);