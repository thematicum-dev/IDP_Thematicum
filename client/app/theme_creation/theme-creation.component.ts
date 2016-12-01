import { Component } from '@angular/core';
import {AutoCompleteComponent} from "../autocomplete/autocomplete.component";
import {ThemeCreationModel} from "../models/themeCreationModel";
import {timeHorizonValues, maturityValues, categoryValues} from "./themeProperties";
import {Theme} from "../models/theme";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html',
    styles: [`.btn-default.active, .btn-default:active {
        background-color: #d9edf7
    }`],
    directives: [AutoCompleteComponent]
})
export class ThemeCreationComponent {
    selectedTags: string[] = [];
    tagsPlaceholder = 'Keyword';
    error: string = '';
    themeCreation: ThemeCreationModel;
    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;


    constructor() {
        let theme = new Theme();
        theme.tags = this.selectedTags;
        this.themeCreation = new ThemeCreationModel(theme);
        this.themeCreation.timeHorizon = -1;
        this.themeCreation.categories = [];
    }

    onNotifySelectedItem(tag: any) {
        //search by name (assume unique name)
        let existingItem = this.selectedTags.find(el => {
            return el.name == tag.name
        });

        //do not add an item if it was already selected
        if(!existingItem) {
            this.selectedTags.push(tag.name);
            console.log(JSON.stringify(this.selectedTags));
        } else {
            this.error = 'This item has already been selected. Please choose another one';
        }
    }

    onTagDeselect(index: number) {
        console.log('index to remove: ' + (index >= 0 && index < this.selectedTags.length));
        if (index >= 0 && index < this.selectedTags.length) {
            this.selectedTags.splice(index, 1);
            console.log(JSON.stringify(this.selectedTags));
        }
    }

    onClearErrorStr() {
        this.error = '';
    }

    onSubmit(form: NgForm) {
        console.log(this.themeCreation);
        console.log(form.value.timeHorizon);
    }

    selectTimeHorizon(timeHorizon: number) {
        this.themeCreation.timeHorizon = timeHorizon;
    }

    selectCategory(category: number, checked: boolean) {
        console.log(checked)
        categoryValues[category-1].checked = !checked;
        if (checked) {
            this.themeCreation.categories.push(category);
        } else {
            alert('not checked')
        }
    }
}