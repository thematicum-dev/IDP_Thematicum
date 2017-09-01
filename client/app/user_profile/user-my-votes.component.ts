import { Component, Input, OnInit } from '@angular/core';
// import { Theme } from '../models/theme';
import { UserProfileService } from '../services/user-profile.service';
import {NewsFeedModel} from "../models/newsFeedModel";

@Component({
    selector: 'app-user-my-votes',
    templateUrl: 'user-my-votes.component.html',
    providers: [UserProfileService],
    styles: [`
        .nobullet {
        list-style-type: none;
        }
    `]
})

export class UserMyVotes implements OnInit {

    constructor(private userProfileService: UserProfileService) { }
    userFeedData: NewsFeedModel[] = []; //to hold data received
    userFeedCursor = 0;
    userFeedCursorLimit = 10;
    showUserFeedData: boolean = true;

    ngOnInit(): void {
        this.getUserFeed();
    }    

    setUserFeed = (data: NewsFeedModel[]) => {
        if(data.length < this.userFeedCursorLimit){
          this.showUserFeedData = false;
        }
        this.userFeedData = this.userFeedData.concat(data);   
    }

    getUserFeed(){
      var fromUser = this.userFeedCursor;
      var toUser = this.userFeedCursor + this.userFeedCursorLimit;
      this.userProfileService.getNewsFeedOfUser(fromUser.toString() , toUser.toString()).subscribe(newsFeed => this.setUserFeed(newsFeed));
    }

    showMore($event){
          console.log("show more votes pressed");
          this.userFeedCursor += this.userFeedCursorLimit;
          this.getUserFeed();
      }

}