import {UserModel} from "../models/userModel";
export class SignupModel {
    constructor(
        public user: UserModel,
        public accessCode: string,
        public currentTime?: number
    ) {
        this.currentTime = new Date().getTime();
    }
}