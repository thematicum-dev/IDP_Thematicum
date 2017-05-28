import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Theme} from "../models/theme";
import { NavigationModel } from "../models/NavigationModel";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ThemeService} from "../services/theme.service";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';
import * as _ from 'underscore';

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html'
})
export class ThemeSearchComponent implements OnInit {
    searchTerm = "";
    themes: Theme[] = [];
    searchResultsCount: number = 0;

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
        this.route.queryParams.subscribe((queryParams: Params) => {
            // this method works with browser back and forward button
            this.searchThemeOnRouteChange(queryParams);
        });
        this.categoryTextOptions.defaultTitle = 'Category';
        this.timeHorizonTextOptions.defaultTitle = 'Time Horizon';
        this.maturityTextOptions.defaultTitle = 'Maturity';
        this.tagTextOptions.defaultTitle = 'Tags';
        this.themeService.getAllThemeTags().subscribe(data => this.updateTagList(data), error => console.log(error));
    }

    searchThemeOnRouteChange(queryParams) {
        if (queryParams['query'])
            this.searchTerm = queryParams['query'].trim()
        else
            this.searchTerm = '';

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
            if (queryParams[param])
                if (Array.isArray(queryParams[param]))
                    return queryParams[param];
                else
                    return [queryParams[param]];
            else
                return [];
        }

        this.tagOptionsModel = getParamStringModel('tags');

        if (!(Object.keys(queryParams).length === 0 && queryParams.constructor === Object))
            this.searchThemes(this.searchTerm, 1, this.categoryOptionsModel, this.maturityOptionsModel, this.timeHorizonOptionsModel, this.tagOptionsModel);
    }

    onSubmit(form: NgForm) {
        // Calls searchThemeOnRouteChange
        this.router.navigate([], {
            queryParams: {
                query: this.searchTerm,
                categories: this.categoryOptionsModel,
                timeHorizon: this.timeHorizonOptionsModel,
                maturity: this.maturityOptionsModel,
                tags: this.tagOptionsModel
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

    searchThemes(searchTerm: any, start: number, categoryOptionsModel: number[], maturityOptionsModel: number[], timeHorizonOptionsModel: number[], tagOptionsModel: string[]) {
        this.themeService.searchThemes(searchTerm, start, categoryOptionsModel, maturityOptionsModel, timeHorizonOptionsModel, tagOptionsModel).subscribe(data => this.updateView(data), error => console.log(error));
    }

    updateTagList(tags) {
        for (let tag of tags) {
            this.tagOptions.push({ id: tag, name: tag });
        }
    }

    navigatePage(page: NavigationModel){
        let start: number = ((page.pageNumber - 1) * page.pageLength) + 1;
        this.searchThemes(this.searchTerm, start, this.categoryOptionsModel, this.maturityOptionsModel, this.timeHorizonOptionsModel, this.tagOptionsModel);
    }

}