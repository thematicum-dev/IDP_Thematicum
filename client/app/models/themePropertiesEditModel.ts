import {categoryValues} from "../models/themePropertyValues";

export class ThemePropertiesEditModel{
    categoryValues = categoryValues;
    categoriesValuesChecked: boolean[];
    public timeHorizon: number = null;
    public maturity: number = null;
    public categories: number[];
 
    constructor() {
        this.categoriesValuesChecked = Array(this.categoryValues.length).fill(false);
    }

    setTimeHorizon(timeHorizon: number) {
        this.timeHorizon = timeHorizon;
    }

    setMaturity(maturity: number) {
        this.maturity = maturity;
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
        this.categoriesValuesChecked.forEach(categoryChecked => categoryChecked = false);
    }

    clearProperties() {
        this.timeHorizon = null;
        this.maturity = null;
        this.categories = null;
        this.uncheckAllCategories();
    }

    hasNoUserInputs() {
        return this.timeHorizon == null || this.maturity == null || this.getCheckedCategories().length == 0;
    }
}