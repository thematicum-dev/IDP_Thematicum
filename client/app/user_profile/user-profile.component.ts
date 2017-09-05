import {Component, OnInit} from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import {NewsFeedModel} from "../models/newsFeedModel";
import {Theme} from '../models/theme';
import {AuthService} from '../auth/auth.service';
@Component({
    selector: 'app-user-profile',
    providers: [UserProfileService, AuthService],
    templateUrl: 'user-profile.component.html',
    styles: [`
        .tabs-left, .tabs-right {
          border-bottom: none;
          padding-top: 2px;
        }
        .tabs-left {
          border-right: 1px solid #ddd;
        }
        .tabs-right {
          border-left: 1px solid #ddd;
        }
        .tabs-left>li, .tabs-right>li {
          float: none;
          margin-bottom: 2px;
        }
        .tabs-left>li {
          margin-right: -1px;
        }
        .tabs-right>li {
          margin-left: -1px;
        }
        .tabs-left>li.active>a,
        .tabs-left>li.active>a:hover,
        .tabs-left>li.active>a:focus {
          border-bottom-color: #ddd;
          border-right-color: transparent;
        }
        
        .tabs-right>li.active>a,
        .tabs-right>li.active>a:hover,
        .tabs-right>li.active>a:focus {
          border-bottom: 1px solid #ddd;
          border-left-color: transparent;
        }
        .tabs-left>li>a {
          border-radius: 4px 0 0 4px;
          margin-right: 0;
          display:block;
        }
        .tabs-right>li>a {
          border-radius: 0 4px 4px 0;
          margin-right: 0;
        }
        .sideways {
          margin-top:50px;
          border: none;
          position: relative;
        }
        .sideways>li {
          height: 20px;
          width: 120px;
          margin-bottom: 100px;
        }
        .sideways>li>a {
          border-bottom: 1px solid #ddd;
          border-right-color: transparent;
          text-align: center;
          border-radius: 4px 4px 0px 0px;
        }
        .sideways>li.active>a,
        .sideways>li.active>a:hover,
        .sideways>li.active>a:focus {
          border-bottom-color: transparent;
          border-right-color: #ddd;
          border-left-color: #ddd;
        }
        .sideways.tabs-left {
          left: -50px;
        }
        .sideways.tabs-right {
          right: -50px;
        }
        .sideways.tabs-right>li {
          -webkit-transform: rotate(90deg);
          -moz-transform: rotate(90deg);
          -ms-transform: rotate(90deg);
          -o-transform: rotate(90deg);
          transform: rotate(90deg);
        }
        .sideways.tabs-left>li {
          -webkit-transform: rotate(-90deg);
          -moz-transform: rotate(-90deg);
          -ms-transform: rotate(-90deg);
          -o-transform: rotate(-90deg);
          transform: rotate(-90deg);
        }
        
        .thick {
          font-weight: bold;
         }

        .nobullet {
          list-style-type: none;
        }

        `]
})

//TODO: load 'bootstrap.vertical-tabs.css'
export class UserProfileComponent implements OnInit{

  constructor(private userProfileService: UserProfileService, private authService: AuthService) { }

  adminFeedCursor = 0;
  adminFeedCursorLimit=10;

  isUserAdmin:boolean = localStorage.getItem('isAdmin') == 'true';
   //newsfeedbyadmin
  newsFeedByAdminString: string = null; //to hold data received
  newsFeedByAdminData: NewsFeedModel[] = []; //to hold data received

  //user values
  username: string;
  email: string;
  datejoined: string;

  defaultFromDateString: string;
  defaultToDateString: string;

  ngOnInit(): void{

    //initializing the date of the admin 'date to' string
    this.defaultFromDateString = new Date(Date.parse(new Date().toISOString())-2685600000).toISOString().slice(0,10);
    this.defaultToDateString = new Date().toISOString().slice(0,10);
    console.log(this.defaultFromDateString);
    console.log(this.defaultToDateString);


    //get the user data
      this.username = this.authService.getLoggedInUser();
      this.email = this.authService.getLoggedInUserEmail();
      this.datejoined = new Date(this.authService.getLoggedInUserDateJoined()).toLocaleDateString();

      if (this.isUserAdmin){
        //this.getAdminFeedWithoutLimits();
        this.getAdminFeedWithDates(this.defaultFromDateString, this.defaultToDateString);
        this.getAdminFeedWithLimits();        
      }
  }

    setAdminFeed = (data: NewsFeedModel[]) => {
      this.newsFeedByAdminData = this.newsFeedByAdminData.concat(data);
    }

    setAdminFeedString = (adminString: string) => {
      this.newsFeedByAdminString = adminString;
    }

    getAdminFeedWithoutLimits(){
      this.userProfileService.getNewsFeedOfAdminWithoutLimits().subscribe(newsFeed => {
          this.setAdminFeedString(JSON.stringify(newsFeed, null, 4))
        });
    }

    getAdminFeedWithLimits(){
          var fromAdminFeed = this.adminFeedCursor;
          var toAdminFeed = this.adminFeedCursorLimit + this.adminFeedCursor;
          this.userProfileService.getNewsFeedOfAdmin(fromAdminFeed.toString(), toAdminFeed.toString()).subscribe(
            newsfeed=>{
              this.setAdminFeed(newsfeed);
            }
          );
    }

    getAdminFeedWithDates(from = null, to = null){
          var dateFromValue = from == null? (<HTMLInputElement>document.getElementById("datefrom")).value : from;
          var dateToValue = to == null?(<HTMLInputElement>document.getElementById("dateto")).value : to;

          var fromAdminDate = dateFromValue ? Date.parse(dateFromValue).toString() : undefined;
          var toAdminDate = dateToValue ? (Date.parse(dateToValue)+86398999).toString() : undefined;
          this.userProfileService.getNewsFeedOfAdminWithDates(fromAdminDate ,toAdminDate).subscribe(
            newsfeed=>{
              this.setAdminFeedString(JSON.stringify(newsfeed, null, 4));
            }
          );
    }
}