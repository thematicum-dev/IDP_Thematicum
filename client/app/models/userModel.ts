export class UserModel {
    constructor(
        public email?: string,
        public password?: string,
        public name?: string,
        public personalRole?: string
    ) {}
}