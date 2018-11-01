import {UserModel} from "../models/userModel";
import {Injectable} from "@angular/core";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {ErrorService} from "../error_handling/error.service";
import {AuthService} from "../auth/auth.service";
import * as Settings from '../utilities/settings';

@Injectable()
export class UserProfileService {
            baseAPI: string = Settings.getBaseApi();
            headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')});
            redirectUrl: string;
            constructor(private http: Http, private router: Router, private errorService: ErrorService, private authService: AuthService) {}

            encodeQueryData(data: any) {
                        let ret = [];
                        for (let d in data)
                                    if(typeof data[d] !== 'undefined' && data[d] !== null)
                                    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                        return "?" + ret.join('&');
            }

            getThemesOfAUser(){
                        var email = this.authService.getLoggedInUserEmail();

                        let apiPath = this.baseAPI + 'profile/newsfeed/themes/' + email;
                        return this.http.get(apiPath , {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch((error => Observable.throw("Error in user profie service")));
            }

            getNewsFeedOfUser(from: string, to: string){
                        var email = this.authService.getLoggedInUserEmail();

                        let params = {from: from, to: to};
                        let searchQuery = this.encodeQueryData(params);
                        let apiPath = this.baseAPI + 'profile/newsfeed/byUser/' + email;
                        return this.http.get(apiPath + searchQuery, {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch((error => Observable.throw("Error in user profie service")));
            }

            getNewsFeedByThemesAUserFollows(from: string, to: string){
                        var email = this.authService.getLoggedInUserEmail();

                        let params = {from: from, to: to};
                        let searchQuery = this.encodeQueryData(params);
                        let apiPath = this.baseAPI + 'profile/newsfeed/byThemesOfAUser/' + email;
                        return this.http.get(apiPath + searchQuery, {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch(this.handleError);
            }

            getNewsFeedOfAdmin(from: string, to: String){
                        var email = this.authService.getLoggedInUserEmail();

                        let params = {from: from, to: to};
                        let searchQuery = this.encodeQueryData(params);
                        let apiPath = this.baseAPI + 'admin/newsfeed/byAdminUser/' + email;
                        return this.http.get(apiPath + searchQuery, {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch(this.handleError);
            }

            getNewsFeedOfAdminWithDates(fromTime: string, toTime: String){
                        var email = this.authService.getLoggedInUserEmail();

                        let params = {fromTime: fromTime, toTime: toTime};
                        let searchQuery = this.encodeQueryData(params);
                        let apiPath = this.baseAPI + 'admin/newsfeed/byAdminUser/' + email;
                        return this.http.get(apiPath + searchQuery, {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch(this.handleError);
            }

            getNewsFeedOfAdminWithoutLimits(){
                        var email = this.authService.getLoggedInUserEmail();

                        let apiPath = this.baseAPI + 'admin/newsfeed/byAdminUser/' + email;
                        return this.http.get(apiPath , {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch((error => Observable.throw("Error in user profie service")));
            }

            getAllUsers() {

                  let apiPath = this.baseAPI + 'admin/activeusers';
                        return this.http.get(apiPath , {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch((error => Observable.throw("Error in user profie service")));
            }

            removeUserById(userId: string) {
                  let apiPath = this.baseAPI + 'admin/removeUserById/' + userId;
                        return this.http.delete(apiPath, {headers: this.headers})
                                    .map((response: Response) => response.json())
                                    .catch(this.handleError);
            }

            sendSubscribersEmail(emailBody: string) {
                  const body = JSON.stringify({
                          email: emailBody         
                    });
                  console.log(body);
                  let apiPath = this.baseAPI + 'activity/sendemail';
                          return this.http.post(apiPath, body, {headers: this.headers})
                              .map((response: Response) => response.json())
                              .catch(this.handleError);
            }     


            handleError = (error: any) => {
                        this.errorService.handleError(error);
                        return Observable.throw(error);
            }
            
}