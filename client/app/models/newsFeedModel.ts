export class UserThemeInput {
            constructor(
                        categories?: number[],
                        maturity?: number,
                        timeHorizon?: 1
            ){}
}

export class UserThemeStockAllocation {
            constructor(
                        exposure?: number,
                        themeStockComposition?: string,
                        user?: string
            ){}
}

export class NewsFeedModel {
    constructor(
        public name?: string,
        public stock?: string,
        public themeName?: string,
        public themeId?: string,
        public userName?: string,
        public userThemeInput?: UserThemeInput,
        public createdAt?: string,
        public userThemeStockAllocation?: UserThemeStockAllocation,
    ) {}
}