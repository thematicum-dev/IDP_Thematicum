import {Component, OnInit} from '@angular/core';
import {AutoCompleteComponent} from "../autocomplete/autocomplete.component";
import {ThemeCreationModel} from "../models/themeCreationModel";
import {timeHorizonValues, maturityValues, categoryValues} from "./themeProperties";
import {Theme} from "../models/theme";
import {NgForm} from "@angular/forms";
import {ThemeCreationService} from "./theme-creation.service";
import {AutocompleteList} from "../autocomplete/autocomplete-list";
import {ThemeTagsService} from "./theme-tags.service";
import {AutocompleteItem} from "../autocomplete/autocomplete-item";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html',
    styles: [`.btn-default.active, .btn-default:active {
        background-color: #d9edf7
    }`],
    directives: [AutoCompleteComponent],
    providers: [ThemeCreationService, ThemeTagsService]
})
export class ThemeCreationComponent implements OnInit {
    selectedTags: string[] = [];
    tagsPlaceholder = 'Keyword';
    allowCustomValues: boolean = true;
    allowEnterKey: boolean = true;
    error: string = '';
    themeCreation: ThemeCreationModel;
    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;
    tagList: AutocompleteItem[] = [];

    ngOnInit(): void {
        this.themeTagService.getAutocompleteList().subscribe(data => {
                for (let tag of data) {
                    this.tagList.push(new AutocompleteItem(tag));
                }
            },
            error => {
                console.log(error)
            });
    }

    constructor(
        private themeCreationService: ThemeCreationService,
        private themeTagService: ThemeTagsService,
        private router: Router) {

        let theme = new Theme();
        theme.tags = this.selectedTags;
        this.themeCreation = new ThemeCreationModel(theme);
    }

    onNotifySelectedItem(tag: any) {
        //search by name (assume unique name)
        let existingItem = this.selectedTags.find(el => {
            return el == tag.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.selectedTags.push(tag.name);
        } else {
            this.error = 'This item has already been selected. Please choose another one';
        }
    }

    onTagDeselect(index: number) {
        if (index >= 0 && index < this.selectedTags.length) {
            this.selectedTags.splice(index, 1);
        }
    }

    onClearErrorStr() {
        this.error = '';
    }

    onSubmit(form: NgForm) {
        //call service to save theme
        this.setCheckedCategories();

        this.themeCreationService.createTheme(this.themeCreation)
            .subscribe(
                data => {
                    console.log(data);
                    this.router.navigate(['/theme', data.obj[0]._id]);
                },
                error =>  {
                    console.log(error)
                    this.error = error;
                }
            );
    }

    selectTimeHorizon(timeHorizon: number) {
        this.themeCreation.timeHorizon = timeHorizon;
    }

    selectMaturity(maturity: number) {
        this.themeCreation.maturity = maturity;
    }

    toggleCheckedCategory(category: number) {
        categoryValues[category-1].checked = !categoryValues[category-1].checked;
    }

    setCheckedCategories() {
        this.themeCreation.categories = categoryValues.filter(category => {
            return category.checked;
            })
            .map(category => {
                return category.value
            });
    }
}