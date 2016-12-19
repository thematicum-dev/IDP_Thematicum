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
import {ThemeSearchComponent} from "./theme_search/theme-search.component";
import {ErrorComponent} from "./error-handling/error.component";
import {AutoCompleteComponent} from "./autocomplete/autocomplete.component";
import {ThemeCreationComponent} from "./theme_creation/theme-creation.component";
import {ThemeDetailsComponent} from "./theme_details/theme-details.component";
import {ErrorService} from "./error-handling/error.service";
import {ThemeService} from "./theme_creation/theme.service";
import {StockAllocationComponent} from "./stock_allocation/stock-allocation.component";
import {AutoCompleteContainerComponent} from "./autocomplete/autocomplete-container.component";
import {AutoCompleteTagsComponent} from "./autocomplete/autocomplete-tags.component";
import {AutoCompleteStockAllocationComponent} from "./autocomplete/autocomplete-stock-allocation.component";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        HomepageComponent,
        AboutComponent,
        SignupComponent,
        SigninComponent,
        ErrorComponent,
        ThemeSearchComponent,
        AutoCompleteComponent,
        ThemeCreationComponent,
        ThemeDetailsComponent,
        StockAllocationComponent,
        AutoCompleteContainerComponent,
        AutoCompleteTagsComponent,
        AutoCompleteStockAllocationComponent
    ],
    imports: [BrowserModule, routing, FormsModule, HttpModule],
    providers: [ AuthService, ErrorService, ThemeService ],
    bootstrap: [AppComponent]
})
export class AppModule {

}