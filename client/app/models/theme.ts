export class Theme {
    constructor(
        public _id?: string,
        public name?: string,
        public description?: string,
        public tags?: string[],
        public creator?: any,
        public createdAt?: Date,
        public updatedAt?: Date,
        public isCurrentUserCreator?: boolean
    ) {}
}