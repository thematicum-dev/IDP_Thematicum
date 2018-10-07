import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navigation/navbar.component";
import { FooterComponent } from "./navigation/footer.component";
import { routing } from "./app.routing";
import { HomepageComponent } from "./navigation/homepage.component";
import { AboutComponent } from "./static_pages/about.component";
import { SignupComponent } from "./auth/signup.component";
import { SigninComponent } from "./auth/signin.component";
import {ForgotComponent } from "./auth/forgot.component";
import {ResetComponent } from "./auth/reset.component";
import { HttpModule } from "@angular/http";
import { AuthService } from "./auth/auth.service";
import { ThemeSearchComponent } from "./theme_search/theme-search.component";
import { ErrorComponent } from "./error_handling/error.component";
import { AutoCompleteComponent } from "./autocomplete/autocomplete.component";
import { ThemeCreationComponent } from "./theme_creation/theme-creation.component";
import { StockCreateComponent } from "./stock/stock-create.component";
import { StockUpdateComponent } from "./stock/stock-update.component";
import { ThemeDetailsComponent } from "./theme_details/theme-details.component";
import { ErrorService } from "./error_handling/error.service";
import { ThemeService } from "./services/theme.service";
import { StockService } from "./services/stock.service";
import { AutoCompleteTagsComponent } from "./autocomplete/autocomplete-tags.component";
import { AutoCompleteStockAllocationComponent } from "./autocomplete/autocomplete-stock-allocation.component";
import { AutoCompleteStockSearchComponent } from "./autocomplete/autocomplete-stock-search.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { ThemePropertiesComponent } from "./theme_details/theme-properties.component";
import { ThemeCharacteristicsEditing } from "./theme_details/theme-characteristics-editing.component";
import { ModalComponent } from "./theme_details/modal.component";
import { ThemeStockAllocationComponent } from "./theme_details/theme-stock-allocation.component";
import { UserProfileComponent } from "./user_profile/user-profile.component";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { PaginationComponent } from './utilities/pagination/pagination.component';
import { FollowComponent } from "./theme_details/follow.component";
import { DeleteThemeComponent } from "./theme_details/delete-theme.component";
import { FeedComponent } from "./user_profile/feed.component";
import { ThemesFollowedComponent } from "./user_profile/themes-followed.component";
import { UserMyVotes } from "./user_profile/user-my-votes.component";
import { UserNewsFeed } from "./user_profile/user-newsfeed.component";
import { AdminStocksManager } from "./admin/admin-stocks-manager.component";
import { AdminFundsManager } from "./admin/admin-funds-manager.component";
import { AdminNewsFeed } from "./admin/admin-news-feed.component";
import { ThemeFeedComponent } from "./theme_details/theme-feed.component";
import { ThemeNewsComponent } from "./theme_details/theme-news.component";
import {FundUpdateComponent} from "./fund/fund-update.component";
import {FundCreateComponent} from "./fund/fund-create.component";
import {ThemeFundAllocationComponent} from "./theme_details/theme-fund-allocation.component";
import {AutoCompleteFundSearchComponent} from "./autocomplete/autocomplete-fund-search.component";
import {AutoCompleteFundAllocationComponent} from "./autocomplete/autocomplete-fund-allocation.component";
import {FundService} from "./services/fund.service";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        HomepageComponent,
        AboutComponent,
        SignupComponent,
        SigninComponent,
        ForgotComponent,
        ResetComponent,
        UserProfileComponent,
        ErrorComponent,
        ThemeSearchComponent,
        AutoCompleteComponent,
        ThemeCreationComponent,
        ThemeDetailsComponent,
        ThemeCharacteristicsEditing,
        ThemePropertiesComponent,
        ThemeStockAllocationComponent,
        AutoCompleteTagsComponent,
        AutoCompleteStockAllocationComponent,
        AutoCompleteStockSearchComponent,
        StockCreateComponent,
        StockUpdateComponent,
        ThemeFundAllocationComponent,
        AutoCompleteFundAllocationComponent,
        AutoCompleteFundSearchComponent,
        FundCreateComponent,
        FundUpdateComponent,
        ModalComponent,
        PaginationComponent,
        FollowComponent,
        DeleteThemeComponent,
        FeedComponent,
        ThemesFollowedComponent,
        UserMyVotes,
        UserNewsFeed,
        AdminStocksManager,
        AdminNewsFeed,
        ThemeFeedComponent,
        ThemeNewsComponent,
        AdminFundsManager
    ],
    imports: [BrowserModule, routing, FormsModule, ReactiveFormsModule, HttpModule, MultiselectDropdownModule],
    providers: [AuthService, ErrorService, ThemeService, StockService, AuthGuard, FundService],
    bootstrap: [AppComponent]
})
export class AppModule {
}