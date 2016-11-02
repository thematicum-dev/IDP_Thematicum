import {Routes, RouterModule} from "@angular/router";
import {HomepageComponent} from "./navigation/homepage.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomepageComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);