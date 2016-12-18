import {timeHorizonValues, maturityValues, categoryValues} from "../models/themePropertyValues";

export class ThemeProperties {
    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;
    // maturityValues = maturityValues;
    // categoryValues = categoryValues;
    public timeHorizon?: number;
    public maturity?: number;
    public categories?: number[];

    setTimeHorizon(timeHorizon: number) {
        console.log('setTimeHorizon')
        this.timeHorizon = timeHorizon;
    }

    setMaturity(maturity: number) {
        console.log('setMaturity')
        this.maturity = maturity;
    }

    toggleCheckedCategory(category: number) {
        console.log('toggleCheckedCategory')
        this.categoryValues[category-1].checked = !categoryValues[category-1].checked;
    }

    setCheckedCategories() {
        console.log('setCheckedCategories')
        this.categories = categoryValues.filter(category => {
            return category.checked;
        }).map(category => {
                return category.value
        });
    }
}
