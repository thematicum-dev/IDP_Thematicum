import {Theme} from "../models/theme";
import {StockAllocationModel} from "../models/stockAllocationModel";
import {ThemePropertiesEditModel} from "../models/themePropertiesEditModel";
export interface ThemeServiceInterface {
    createTheme(theme: Theme);
    createManyStockCompositionsAndAllocations(themeId: any, stockAllocation: StockAllocationModel[]);
    createUserThemeInput(themeId: any, themeProperties: ThemePropertiesEditModel);
    updateUserThemeInput(userThemeInputId: any, themeProperties: ThemePropertiesEditModel);
    deleteUserThemeInput(userThemeInputId: string);
    updateTheme(theme: Theme);
    searchThemes(searchTerm: string, limit: number);
    getThemeById(id: string);
    getThemeProperties(themeId: string);
    getThemeStockAllocationDistribution(themeId: string);
    updateUserStockAllocation(allocationId: string, exposure: number);
    createUserStockAllocation(themeStockCompositionId: string, exposure: number);
    deleteUserStockAllocation(allocationId: string);
    deleteTheme(themeId: string);
}