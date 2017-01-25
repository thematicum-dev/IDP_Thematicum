import {categoryValues} from "../models/themePropertyValues";

export class ThemeProperties {
    categoryValues = categoryValues;

    public timeHorizon: number = null;
    public maturity: number = null;
    public categories: number[];

    setTimeHorizon(timeHorizon: number) {
        this.timeHorizon = timeHorizon;
    }

    setMaturity(maturity: number) {
        this.maturity = maturity;
    }

    toggleCheckedCategory(category: number) {
        this.categoryValues[category].checked = !categoryValues[category].checked;
    }

    setCheckedCategories() {
        this.categories = this.getCheckedCategories();
    }

    getCheckedCategories() {
        return categoryValues.filter(category => {
            return category.checked;
        }).map(category => {
            return category.value
        });
    }

    uncheckAllCategories() {
        this.categoryValues.forEach(category => category.checked = false);
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
