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
            this.searchThemes(this.searchTerm);
        } else if(this.route.snapshot.queryParams['all'] && this.route.snapshot.queryParams['all'] === 'true') {
            this.searchThemes(null);
        }
    }


    onSubmit(form: NgForm) {
        if(this.searchTerm) {
            this.router.navigate([], {queryParams:{query: this.searchTerm}});
            this.searchThemes(this.searchTerm);
        } else {
            this.router.navigate([], {queryParams:{all: 'true'}});
            this.searchThemes(null);
        }
    }

    goToThemeDetails(themeId: string) {
        this.router.navigate(['/theme', themeId]);
    }

    updateView(data: any){
        this.themes = data.result;
    }

    searchThemes(searchTerm: any) {
        this.themeService.searchThemes(searchTerm).subscribe(data => this.updateView(data), error => console.log(error));
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
        { id: 1, name: 'Economic'},
        { id: 2, name: 'Technologic' },
        { id: 3, name: 'Environmental'},
        { id: 4, name: 'Political'},
        { id: 5, name: 'Regulatory'},
        { id: 6, name: 'Sociologic'}
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
        { id: 1, name: 'Short Term'},
        { id: 2, name: 'Medium Term'},
        { id: 3, name: 'Long Term'}
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
        { id: 1, name: 'Upcoming'},
        { id: 2, name: 'Nascent'},
        { id: 3, name: 'Accelerating'},
        { id: 4, name: 'Mature'},
        { id: 5, name: 'Declining'}
    ];

    tagOptionsModel: number[] = []; 
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
        { id: 1, name: 'aTag 1'},
        { id: 2, name: 'bTag 2'},
        { id: 3, name: 'aTag 3'},
        { id: 4, name: 'cTag 4'},
        { id: 5, name: 'fTag 5'},
        { id: 6, name: 'cTag 6'},
        { id: 7, name: 'dTag 7'},
        { id: 8, name: 'tTag 8'},
        { id: 9, name: 'eTag 9'},
        { id: 10, name: 'dTag 10'},
        { id: 11, name: 'aTag 11'}
    ];
}