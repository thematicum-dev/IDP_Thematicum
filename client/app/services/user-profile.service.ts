import {UserModel} from "../models/userModel";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {ErrorService} from "../error_handling/error.service";
import {AuthService} from "../auth/auth.service";
import * as Settings from '../utilities/settings';

@Injectable()
export class FollowService {
}