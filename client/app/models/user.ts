export class User {
    constructor(
        public email: string,
        public password: string,
        public name?: string,
        public personalRole?: string
    ) {}
}