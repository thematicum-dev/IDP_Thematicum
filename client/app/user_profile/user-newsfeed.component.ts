import { Component, Input, OnInit } from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import { NewsFeedModel } from "../models/newsFeedModel";

@Component({
    selector: 'app-user-newsfeed',
    templateUrl: 'user-newsfeed.component.html',
    providers: [UserProfileService],
    styles: [`
        .nobullet {
        list-style-type: none;
        }
    `]
})

export class UserNewsFeed implements OnInit {

    constructor(private userProfileService: UserProfileService) { }

    overAllFeedData: NewsFeedModel[] = [];
    overAllFeedCursor = 0;
    overAllFeedCursorLimit = 10;
    showOverAllFeedData:boolean = true;

    ngOnInit(): void {
        this.getOverAllFeed();
    }

    setOverAllFeed = (data: NewsFeedModel[]) => {
        if (data.length < this.overAllFeedCursorLimit) {
            this.showOverAllFeedData = false;
        }
        this.overAllFeedData = this.overAllFeedData.concat(data);
    }

    getOverAllFeed() {
        var fromNewsFeed = this.overAllFeedCursor;
        var toNewsFeed = this.overAllFeedCursorLimit + this.overAllFeedCursor;
        this.userProfileService.getNewsFeedByThemesAUserFollows(fromNewsFeed.toString(), toNewsFeed.toString()).subscribe(newsFeed => this.setOverAllFeed(newsFeed));
    }

    showMore($event) {
        this.overAllFeedCursor += this.overAllFeedCursorLimit;
        this.getOverAllFeed();
    }
}