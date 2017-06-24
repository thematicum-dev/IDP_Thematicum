import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Theme} from "../models/theme";
import { NavigationModel } from "../models/navigationModel";
import {StockModel} from "../models/stockModel";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ThemeService} from "../services/theme.service";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
import * as _ from 'underscore';
import { PaginationComponent } from '../utilities/pagination/pagination.component';
import {categoryValues_IM, maturityValues_IM, timeHorizonValues_IM, searchDisabled_IM, searchEnabled_IM, categoryTextOptions_IM, timeHorizonTextOptions_IM, maturityTextOptions_IM, tagTextOptions_IM} from "../models/IMultiSelectSettings";

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html'
})
export class ThemeSearchComponent implements OnInit {
    searchTerm: string = "";
    themes: Theme[] = [];
    searchResultsCount: number = 0;
    currentPage: number = 1;
    initialPage: number;
    activeSearchType: number = 1;
    @ViewChild('searchPagePagination') searchPagePaginationComponent: PaginationComponent;

    categoryTextOptions = categoryTextOptions_IM;
    timeHorizonTextOptions = timeHorizonTextOptions_IM;
    maturityTextOptions = maturityTextOptions_IM;
    tagTextOptions = tagTextOptions_IM;

    categoryOptionsModel: number[] = [];
    timeHorizonOptionsModel: number[] = [];
    maturityOptionsModel: number[] = [];
    tagOptionsModel: string[] = [];

    categoryOptions: IMultiSelectOption[] = categoryValues_IM;
    timeHorizonOptions: IMultiSelectOption[] = timeHorizonValues_IM;
    maturityOptions: IMultiSelectOption[] = maturityValues_IM;
    tagOptions: IMultiSelectOption[] = [];

    noSearchDropdownSettings: IMultiSelectSettings = searchDisabled_IM;
    searchDropdownSettings: IMultiSelectSettings = searchEnabled_IM;

    constructor(private themeService: ThemeService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.themeService.getAllThemeTags().subscribe(data => this.updateTagList(data), error => console.log(error));
        this.route.queryParams.subscribe((queryParams: Params) => {
            // this method works with browser back and forward button
            this.searchThemeOnRouteChange(queryParams);
        });
    }

    searchThemeOnRouteChange(queryParams) {
        if (queryParams['query'])
            this.searchTerm = queryParams['query'].trim()
        else
            this.searchTerm = '';

        if (queryParams['currentPage']){
            this.currentPage = parseInt(queryParams['currentPage'], 10);
            this.initialPage = this.currentPage; // by default component will set value to 1
        }
        else
            this.currentPage = 1;

        if (queryParams['searchType']){
            this.activeSearchType = parseInt(queryParams['searchType'], 10);
        }
        else
            this.activeSearchType = 1;

        var getParamNumberModel = function (param) {
            if (queryParams[param])
                if (Array.isArray(queryParams[param]))
                    return queryParams[param].map(Number);
                else
                    return [parseInt(queryParams[param], 10)];
            else
                return [];
        }

        this.categoryOptionsModel = getParamNumberModel('categories');
        this.timeHorizonOptionsModel = getParamNumberModel('timeHorizon');
        this.maturityOptionsModel = getParamNumberModel('maturity');

        var getParamStringModel = function (param) {
            if (queryParams[param]){
                let tags = JSON.parse(queryParams[param]);
                if (Array.isArray(tags))
                    return tags;
                else
                    return [tags];
            }
            else
                return [];
        }

        this.tagOptionsModel = getParamStringModel('tags');

        if (!(Object.keys(queryParams).length === 0 && queryParams.constructor === Object))
            this.searchThemes(this.searchTerm, this.activeSearchType, this.categoryOptionsModel, this.maturityOptionsModel, this.timeHorizonOptionsModel, this.tagOptionsModel);
    }

    onSubmit(form: NgForm) {
            this.routeChange(1, this.activeSearchType);
    }

    routeChange(currentPage: number, activeSearchType: number) {
        // Calls searchThemeOnRouteChange
        this.router.navigate([], {
            queryParams: {
                query: this.searchTerm,
                categories: this.categoryOptionsModel,
                timeHorizon: this.timeHorizonOptionsModel,
                maturity: this.maturityOptionsModel,
                tags: JSON.stringify(this.tagOptionsModel),
                currentPage: currentPage,
                searchType: activeSearchType
            }
        });    
    }

    goToThemeDetails(themeId: string) {
        this.router.navigate(['/theme', themeId]);
    }

    updateView(data: any) {
        this.searchResultsCount = data[0];
        this.themes = data[1];
    }

    searchThemes(searchTerm: string, searchType: number, categoryOptionsModel: number[], maturityOptionsModel: number[], timeHorizonOptionsModel: number[], tagOptionsModel: string[]) {
        this.searchPagePaginationComponent.currentPage = this.currentPage; // check this line later. Needed for back button to work properly as this function ends up being called before initialPage is passed to pagionation component
        let start: number = this.searchPagePaginationComponent.nextResultStartsFrom();
        this.themeService.searchThemes(searchTerm, searchType, start, categoryOptionsModel, maturityOptionsModel, timeHorizonOptionsModel, tagOptionsModel).subscribe(data => this.updateView(data), error => console.log(error));
    }

    updateTagList(tags) {
        for (let tag of tags) {
            this.tagOptions.push({ id: tag, name: tag });
        }
    }

    navigatePage(page: NavigationModel) {
        this.routeChange(page.pageNumber, this.activeSearchType);
    }

    changeActiveSearchType(type: number){
        this.activeSearchType = type;
        this.searchTerm = "";
    }

    searchTermStock(stock: StockModel){
        this.searchTerm = stock._id;
    }

}