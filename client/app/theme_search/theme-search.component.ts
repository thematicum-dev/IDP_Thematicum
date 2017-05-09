import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Theme} from "../models/theme";
import {Router, ActivatedRoute} from "@angular/router";
import {ThemeService} from "../services/theme.service";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-theme-search',
    templateUrl: 'theme-search.component.html' 
})
export class ThemeSearchComponent implements OnInit {
    searchTerm = "";
    themes: Theme[] = [];
    constructor(private themeService: ThemeService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        //TODO: refactor - create separate classes to override the 2 cases implementation
        if(this.route.snapshot.queryParams['query']) {
            this.searchTerm = this.route.snapshot.queryParams['query'].trim();
            this.searchThemes(this.searchTerm, [], [], [], []);
        } else if(this.route.snapshot.queryParams['all'] && this.route.snapshot.queryParams['all'] === 'true') {
            this.searchThemes(null, [], [], [], []);
        }
    }

    onSubmit(form: NgForm) {
        if(this.searchTerm) {
            this.router.navigate([], {queryParams:{query: this.searchTerm}});
            this.searchThemes(this.searchTerm, this.categoryOptionsModel, this.maturityOptionsModel, this.timeHorizonOptionsModel, this.tagOptionsModel);
        } else {
            this.router.navigate([], {queryParams:{all: 'true'}});
            this.searchThemes(null, this.categoryOptionsModel, this.maturityOptionsModel, this.timeHorizonOptionsModel, this.tagOptionsModel);
        }
    }

    goToThemeDetails(themeId: string) {
        this.router.navigate(['/theme', themeId]);
    }

    updateView(data: any){
        this.themes = data.result;
    }

    searchThemes(searchTerm: any, categoryOptionsModel: number[], maturityOptionsModel: number[], timeHorizonOptionsModel: number[], tagOptionsModel: string[]) {
        this.themeService.searchThemes(searchTerm, categoryOptionsModel, maturityOptionsModel, timeHorizonOptionsModel, tagOptionsModel).subscribe(data => this.updateView(data), error => console.log(error));
    }  

    // TODO: Find a way to reuse code for settings and options
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
   
    categoryTextOptions: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Category',
        allSelected: 'All Selected'
    };
    categoryOptionsModel: number[] = []; 
    categoryOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Economic'},
        { id: 1, name: 'Technologic' },
        { id: 2, name: 'Environmental'},
        { id: 3, name: 'Political'},
        { id: 4, name: 'Regulatory'},
        { id: 5, name: 'Sociologic'}
    ];


    timeHorizonOptionsModel: number[] = []; 
    timeHorizonTextOptions: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Time Horizon',
        allSelected: 'All Selected'
    };
    timeHorizonOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Short Term'},
        { id: 1, name: 'Medium Term'},
        { id: 2, name: 'Long Term'}
    ];

    maturityOptionsModel: number[] = [];
    maturityTextOptions: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Maturity',
        allSelected: 'All Selected'
    }; 
    maturityOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Upcoming'},
        { id: 1, name: 'Nascent'},
        { id: 2, name: 'Accelerating'},
        { id: 3, name: 'Mature'},
        { id: 4, name: 'Declining'}
    ];

    tagOptionsModel: string[] = []; 
    tagTextOptions: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Search',
        defaultTitle: 'Tags',
        allSelected: 'All Selected'
    }; 
    tagOptions: IMultiSelectOption[] = [
        { id: 'aTag 1', name: 'aTag 1'},
        { id: 'bTag 2', name: 'bTag 2'},
        { id: 'aTag 3', name: 'aTag 3'},
        { id: 'cTag 4', name: 'cTag 4'},
        { id: 'fTag 5', name: 'fTag 5'},
        { id: 'cTag 6', name: 'cTag 6'},
        { id: 'dTag 7', name: 'dTag 7'},
        { id: 'tTag 8', name: 'tTag 8'},
        { id: 'eTag 9', name: 'eTag 9'},
        { id: 'dTag 10', name: 'dTag 10'},
        { id: 'aTag 11', name: 'aTag 11'}
    ];
}