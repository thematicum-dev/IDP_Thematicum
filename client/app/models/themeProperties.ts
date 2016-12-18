import {timeHorizonValues, maturityValues, categoryValues} from "../models/themePropertyValues";

export class ThemeProperties {
    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;

    public timeHorizon?: number;
    public maturity?: number;
    public categories?: number[];

    setTimeHorizon(timeHorizon: number) {
        this.timeHorizon = timeHorizon;
    }

    setMaturity(maturity: number) {
        this.maturity = maturity;
    }

    toggleCheckedCategory(category: number) {
        this.categoryValues[category-1].checked = !categoryValues[category-1].checked;
    }

    setCheckedCategories() {
        this.categories = categoryValues.filter(category => {
            return category.checked;
        }).map(category => {
                return category.value
        });
    }
}
