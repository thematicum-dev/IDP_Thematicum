import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from "./app.component";
import {NavbarComponent} from "./navigation/navbar.component";
import {FooterComponent} from "./navigation/footer.component";

import { routing } from "./app.routing";
import {HomepageComponent} from "./navigation/homepage.component";
import {AboutComponent} from "./static_pages/about.component";
import {SignupComponent} from "./auth/signup.component";
import {SigninComponent} from "./auth/signin.component";
import {HttpModule} from "@angular/http";
import {AuthService} from "./auth/auth.service";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        HomepageComponent,
        AboutComponent,
        SignupComponent,
        SigninComponent
    ],
    imports: [BrowserModule, routing, FormsModule, HttpModule],
    providers: [ AuthService ],
    bootstrap: [AppComponent]
})
export class AppModule {

}