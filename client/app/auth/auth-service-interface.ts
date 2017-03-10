import {SignupModel} from "./signup-model";
import {UserModel} from "../models/userModel";
export interface AuthServiceInterface {
    signup(signupModel: SignupModel);
    signin(user: UserModel);
    isLoggedIn();
}