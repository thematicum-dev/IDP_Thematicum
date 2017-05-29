import {SignupModel} from "./signup-model";
import {UserModel} from "../models/userModel";
export interface AuthServiceInterface {
    signup(signupModel: SignupModel, captcha: String);
    signin(user: UserModel, captcha: String);
    isLoggedIn();
}