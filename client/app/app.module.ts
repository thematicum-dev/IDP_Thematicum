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

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        HomepageComponent,
        AboutComponent,
        SignupComponent
    ],
    imports: [BrowserModule, routing, FormsModule ],
    bootstrap: [AppComponent]
})
export class AppModule {

}