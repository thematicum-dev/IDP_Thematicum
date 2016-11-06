import {User} from "../models/user";
export class SignupModel {
    constructor(
        public user: User,
        public accessCode: string,
        public currentTime?: number
    ) {
        this.currentTime = new Date().getTime();
    }
}