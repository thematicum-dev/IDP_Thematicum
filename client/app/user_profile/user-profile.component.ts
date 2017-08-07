import {Component, OnInit} from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import {NewsFeedModel} from "../models/newsFeedModel";
import {Theme} from '../models/theme';
@Component({
    selector: 'app-user-profile',
    providers: [UserProfileService],
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
        
        .nobullet {
          list-style-type: none;
        }

        `]
})

//TODO: load 'bootstrap.vertical-tabs.css'
export class UserProfileComponent implements OnInit{

  constructor(private userProfileService: UserProfileService) { }

  //the newsfeed log cursor for users own activity
  userNewsFeedCursor = 0;
  userNewsFeedCursorLimit = 10;

  overallNewsFeedCursor = 0;
  overallNewsFeedCursorLimit = 10;

  overAllAdminCursor = 0;
  overAllAdminCursorLimit=10;

  //newsfeedbyuserdata
  newsFeedByUserData: NewsFeedModel[] = []; //to hold data received

  //newsfeedbyusersthemes
  newsFeedByUsersThemesData: NewsFeedModel[] = []; //to hold data received

  isUserAdmin:boolean = localStorage.getItem('isAdmin') == 'true';
   //newsfeedbyadmin
  newsFeedByAdminString: string = null; //to hold data received
  newsFeedByAdminData: NewsFeedModel[] = []; //to hold data received

  //themes the user follows
  themes: Theme[] = []


  ngOnInit(): void{

      //get themes data
      this.userProfileService.getThemesOfAUser().subscribe(themes =>this.setThemes(themes));

      var fromUser = this.userNewsFeedCursor;
      var toUser = this.userNewsFeedCursor + this.userNewsFeedCursorLimit;
      this.userProfileService.getNewsFeedOfUser(fromUser.toString() , toUser.toString()).subscribe(newsFeed => this.setUsersActivity(newsFeed));

      var fromNewsFeed = this.overallNewsFeedCursor;
      var toNewsFeed = this.overallNewsFeedCursorLimit + this.overallNewsFeedCursor;
      this.userProfileService.getNewsFeedByThemesAUserFollows(fromNewsFeed.toString() , toNewsFeed.toString()).subscribe(newsFeed => this.setNewsFeed(newsFeed));

      if (this.isUserAdmin){
        this.userProfileService.getNewsFeedOfAdminWithoutLimits().subscribe(newsFeed => {
          this.setNewsFeedByAdminString(JSON.stringify(newsFeed, null, 4))
        });

        if (this.isUserAdmin){
          var fromAdminFeed = this.overAllAdminCursor;
          var toAdminFeed = this.overAllAdminCursorLimit + this.overAllAdminCursor;
          this.userProfileService.getNewsFeedOfAdmin(fromAdminFeed.toString(), toAdminFeed.toString()).subscribe(
            newsfeed=>{
              this.setAdminFeedData(newsfeed);
            }
          );
        }
        
      }
  }

  setUsersActivity = (data: NewsFeedModel[]) => {
        //console.log('Stock Allocations');
        this.newsFeedByUserData = data;
        //console.log(this.newsFeedByUserData);
    }

    setNewsFeed = (data: NewsFeedModel[]) => {
        this.newsFeedByUsersThemesData = data;
    }

    setAdminFeedData = (data: NewsFeedModel[]) => {
      this.newsFeedByAdminData = data;
    }

    setNewsFeedByAdminString = (adminString: string) => {
      this.newsFeedByAdminString = adminString;
    }

    setThemes = (themes: Theme[]) => {
      console.log(themes);
      this.themes = themes;
    }
}