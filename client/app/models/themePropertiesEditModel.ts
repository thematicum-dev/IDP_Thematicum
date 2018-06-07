import {categoryValues} from "../models/themePropertyValues";

export class ThemePropertiesEditModel{
    categoryValues = categoryValues;
    categoriesValuesChecked: boolean[];
    public timeHorizon: number = null;
    public maturity: number = null;
    public categories: number[];
    public geography: number = null;

 
    constructor() {
        this.categoriesValuesChecked = Array(this.categoryValues.length).fill(false);
    }

    setTimeHorizon(timeHorizon: number) {
        this.timeHorizon = timeHorizon;
    }

    setMaturity(maturity: number) {
        this.maturity = maturity;
    }

    setGeography(geography: number) {
        this.geography = geography;
    }

    toggleCheckedCategory(category: number) {
        this.categoriesValuesChecked[category] = !this.categoriesValuesChecked[category];
    }

    setCheckedCategories() {
        this.categories = this.getCheckedCategories();
    }

    getCheckedCategories() {
        let categories: number[] = [];
        this.categoriesValuesChecked.forEach((value, index) => {
            if (value)
                categories.push(index)
        });
        return categories;
    }

    uncheckAllCategories() {
        this.categoriesValuesChecked.forEach((value, index) => {
            this.categoriesValuesChecked[index] = false;
        });
    }

    clearProperties() {
        this.timeHorizon = null;
        this.maturity = null;
        this.categories = null;
        this.geography = null;
        this.uncheckAllCategories();
    }

    hasNoUserInputs() {
        return this.timeHorizon == null || this.maturity == null || this.geography == null || this.getCheckedCategories().length == 0;
    }
}