import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
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
import {AutoCompleteTagsComponent} from "./autocomplete/autocomplete-tags.component";
import {AutoCompleteStockAllocationComponent} from "./autocomplete/autocomplete-stock-allocation.component";
import {ErrorPageComponent} from "./static_pages/error-page.component";
import {AuthGuard} from "./auth/auth-guard.service";
import {ThemePropertiesComponent} from "./theme_details/theme-properties.component";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {ThemeCharacteristicsEditingComponent} from "./theme_creation/theme-characteristics-editing.component";
import {ModalComponent} from "./theme_details/modal.component";
import {ThemeStockAllocationComponent} from "./stock_allocation/theme-stock-allocation.component";
import {UserProfileComponent} from "./user_profile/user-profile.component";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        HomepageComponent,
        AboutComponent,
        SignupComponent,
        SigninComponent,
        UserProfileComponent,
        ErrorComponent,
        ThemeSearchComponent,
        AutoCompleteComponent,
        ThemeCreationComponent,
        ThemeDetailsComponent,
        ThemeCharacteristicsEditingComponent,
        ThemePropertiesComponent,
        ThemeStockAllocationComponent,
        AutoCompleteTagsComponent,
        AutoCompleteStockAllocationComponent,
        ErrorPageComponent,
        ModalComponent
    ],
    imports: [BrowserModule, routing, FormsModule, ReactiveFormsModule, HttpModule, Ng2Bs3ModalModule],
    providers: [ AuthService, ErrorService, ThemeService, AuthGuard ],
    bootstrap: [AppComponent]
})
export class AppModule {

}