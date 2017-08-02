import {Component, OnInit} from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import {NewsFeedModel} from "../models/newsFeedModel";
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
        `]
})

//TODO: load 'bootstrap.vertical-tabs.css'
export class UserProfileComponent implements OnInit{

  constructor(private userProfileService: UserProfileService) { }

  //the newsfeed log cursor for users own activity
  userNewsFeedCursor = 0;
  userNewsFeedCursorLimit = 1;

  overallNewsFeedCursor = 0;
  overallNewsFeedCursorLimit = 10;

  //newsfeedbyuserdata
  newsFeedByUserData: NewsFeedModel[] = []; //to hold data received

  //newsfeedbyusersthemes
  newsFeedByUsersThemesData: NewsFeedModel[] = []; //to hold data received


  ngOnInit(): void{
      var fromUser = this.userNewsFeedCursor;
      var toUser = this.userNewsFeedCursor + this.userNewsFeedCursorLimit;
      this.userProfileService.getNewsFeedOfUser(fromUser.toString() , toUser.toString()).subscribe(newsFeed => this.setUsersActivity(newsFeed));

      var fromNewsFeed = this.overallNewsFeedCursor;
      var toNewsFeed = this.overallNewsFeedCursorLimit;
      this.userProfileService.getNewsFeedByThemesAUserFollows(fromNewsFeed.toString() , toNewsFeed.toString()).subscribe(newsFeed => this.setNewsFeed(newsFeed));
  }

  setUsersActivity = (data: NewsFeedModel[]) => {
        //console.log('Stock Allocations');
        this.newsFeedByUserData = data;
        //console.log(this.newsFeedByUserData);
    }

    setNewsFeed = (data: NewsFeedModel[]) => {
        console.log('Stock Allocations');
        this.newsFeedByUsersThemesData = data;
        console.log(this.newsFeedByUsersThemesData);
    }


}