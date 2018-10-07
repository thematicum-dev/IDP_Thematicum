export class UserThemeInput {
            constructor(
                        public categories?: number[],
                        public maturity?: number,
                        public geography?: number,
                        public sectors?: number,
                        public timeHorizon?: 1,
            ){}
}

export class UserThemeStockAllocation {
            constructor(
                        public exposure?: number,
                        public themeStockComposition?: string,
                        public user?: string
            ){}
}

export class UserThemeFundAllocation {
    constructor(
        public exposure?: number,
        public themeFundComposition?: string,
        public user?: string
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