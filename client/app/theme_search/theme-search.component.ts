import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Theme} from "../models/theme";
import { NavigationModel } from "../models/navigationModel";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ThemeService} from "../services/theme.service";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
import * as _ from 'underscore';
import { PaginationComponent } from '../utilities/pagination/pagination.component';

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html'
})
export class ThemeSearchComponent implements OnInit {
    searchTerm = "";
    themes: Theme[] = [];
    searchResultsCount: number = 0;
    currentPage: number = 1;
    initialPage: number;
    @ViewChild('searchPagePagination') searchPagePaginationComponent: PaginationComponent;

    generalTextOptions: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: '',
        allSelected: 'All Selected'
    };
    categoryTextOptions = _.clone(this.generalTextOptions);
    timeHorizonTextOptions = _.clone(this.generalTextOptions);
    maturityTextOptions = _.clone(this.generalTextOptions);
    tagTextOptions = _.clone(this.generalTextOptions);

    categoryOptionsModel: number[] = [];
    timeHorizonOptionsModel: number[] = [];
    maturityOptionsModel: number[] = [];
    tagOptionsModel: string[] = [];

    categoryOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Economic' },
        { id: 1, name: 'Technologic' },
        { id: 2, name: 'Environmental' },
        { id: 3, name: 'Political' },
        { id: 4, name: 'Regulatory' },
        { id: 5, name: 'Sociologic' }
    ];
    timeHorizonOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Short Term' },
        { id: 1, name: 'Medium Term' },
        { id: 2, name: 'Long Term' }
    ];
    maturityOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Upcoming' },
        { id: 1, name: 'Nascent' },
        { id: 2, name: 'Accelerating' },
        { id: 3, name: 'Mature' },
        { id: 4, name: 'Declining' }
    ];
    tagOptions: IMultiSelectOption[] = [];

    noSearchDropdownSettings: IMultiSelectSettings = {
        enableSearch: false,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default btn-block',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: true,
        containerClasses: 'full-width'
    };
    searchDropdownSettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default btn-block',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: true,
        containerClasses: 'full-width'
    };

    constructor(private themeService: ThemeService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.categoryTextOptions.defaultTitle = 'Category';
        this.timeHorizonTextOptions.defaultTitle = 'Time Horizon';
        this.maturityTextOptions.defaultTitle = 'Maturity';
        this.tagTextOptions.defaultTitle = 'Tags';
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
            this.searchThemes(this.searchTerm, this.categoryOptionsModel, this.maturityOptionsModel, this.timeHorizonOptionsModel, this.tagOptionsModel);
    }

    onSubmit(form: NgForm) {
        this.routeChange(1);
    }

    routeChange(currentPage: number) {
        // Calls searchThemeOnRouteChange
        this.router.navigate([], {
            queryParams: {
                query: this.searchTerm,
                categories: this.categoryOptionsModel,
                timeHorizon: this.timeHorizonOptionsModel,
                maturity: this.maturityOptionsModel,
                tags: JSON.stringify(this.tagOptionsModel),
                currentPage: currentPage
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

    searchThemes(searchTerm: any, categoryOptionsModel: number[], maturityOptionsModel: number[], timeHorizonOptionsModel: number[], tagOptionsModel: string[]) {
        let start: number = this.searchPagePaginationComponent.nextResultStartsFrom();
        this.themeService.searchThemes(searchTerm, start, categoryOptionsModel, maturityOptionsModel, timeHorizonOptionsModel, tagOptionsModel).subscribe(data => this.updateView(data), error => console.log(error));
    }

    updateTagList(tags) {
        for (let tag of tags) {
            this.tagOptions.push({ id: tag, name: tag });
        }
    }

    navigatePage(page: NavigationModel) {
        this.routeChange(page.pageNumber);
    }

}