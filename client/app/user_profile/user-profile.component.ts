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

  //the newsfeed log cursor for users own activity
  userFeedCursor = 0;
  userFeedCursorLimit = 10;

  overAllFeedCursor = 0;
  overAllFeedCursorLimit = 10;

  adminFeedCursor = 0;
  adminFeedCursorLimit=10;

  //newsfeedbyuserdata
  userFeedData: NewsFeedModel[] = []; //to hold data received
  showUserFeedData: boolean = true;

  //newsfeedbyusersthemes
  overAllFeedData: NewsFeedModel[] = []; //to hold data received
  showOverAllFeedData:boolean = true;

  isUserAdmin:boolean = localStorage.getItem('isAdmin') == 'true';
   //newsfeedbyadmin
  newsFeedByAdminString: string = null; //to hold data received
  newsFeedByAdminData: NewsFeedModel[] = []; //to hold data received

  //themes the user follows
  themes: Theme[] = []

  //user values
  username: string;
  email: string;
  datejoined: string;


  ngOnInit(): void{


    //get the user data
      this.username = this.authService.getLoggedInUser();
      this.email = this.authService.getLoggedInUserEmail();
      this.datejoined = new Date(this.authService.getLoggedInUserDateJoined()).toLocaleDateString();


      //get themes data
      this.userProfileService.getThemesOfAUser().subscribe(themes =>this.setThemes(themes));

      this.getUserFeed();

      this.getOverAllFeed();

      if (this.isUserAdmin){
        this.getAdminFeedWithoutLimits();
        this.getAdminFeedWithLimits();        
      }
  }

  setUserFeed = (data: NewsFeedModel[]) => {
        if(data.length < this.userFeedCursorLimit){
          this.showUserFeedData = false;
        }
        this.userFeedData = this.userFeedData.concat(data);   
    }

    setOverAllFeed = (data: NewsFeedModel[]) => {
        if(data.length < this.overAllFeedCursorLimit){
          this.showOverAllFeedData = false;
        }
        this.overAllFeedData = this.overAllFeedData.concat(data);
    }

    setAdminFeed = (data: NewsFeedModel[]) => {
      this.newsFeedByAdminData = this.newsFeedByAdminData.concat(data);
    }

    setAdminFeedString = (adminString: string) => {
      this.newsFeedByAdminString = adminString;
    }

    setThemes = (themes: Theme[]) => {
      this.themes = themes;
    }

    showMore($event, flag){
      if(flag){ //means that show more was pressed in users own votes
        console.log("show more votes pressed");
        this.userFeedCursor += this.userFeedCursorLimit;
        this.getUserFeed();

      }else{ //means that show more was pressed in users newsfeed for themes that the user follows
        console.log("show more activity log pressed");
        this.overAllFeedCursor += this.overAllFeedCursorLimit;
        this.getOverAllFeed();
      }
    }

    getUserFeed(){
      var fromUser = this.userFeedCursor;
      var toUser = this.userFeedCursor + this.userFeedCursorLimit;
      this.userProfileService.getNewsFeedOfUser(fromUser.toString() , toUser.toString()).subscribe(newsFeed => this.setUserFeed(newsFeed));
    }

    getOverAllFeed(){
      var fromNewsFeed = this.overAllFeedCursor;
      var toNewsFeed = this.overAllFeedCursorLimit + this.overAllFeedCursor;
      this.userProfileService.getNewsFeedByThemesAUserFollows(fromNewsFeed.toString() , toNewsFeed.toString()).subscribe(newsFeed => this.setOverAllFeed(newsFeed));
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
}