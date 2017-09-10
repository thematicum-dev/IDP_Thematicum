import { Component, Input, OnInit } from '@angular/core';
import { NewsFeedModel } from "../models/newsFeedModel";
import { UserProfileService } from '../services/user-profile.service';

@Component({
    selector: 'app-admin-news-feed',
    providers: [UserProfileService],
    templateUrl: 'admin-news-feed.component.html',
})

export class AdminNewsFeed implements OnInit {

    adminFeedCursor = 0;
    adminFeedCursorLimit = 10;
    isUserAdmin: boolean = localStorage.getItem('isAdmin') == 'true';
    newsFeedByAdminString: string = null; //to hold data received
    newsFeedByAdminData: NewsFeedModel[] = []; //to hold data received
    defaultFromDateString: string;
    defaultToDateString: string;

    constructor(private userProfileService: UserProfileService) { }

    ngOnInit(): void {
        //initializing the date of the admin 'date to' string
        this.defaultFromDateString = new Date(Date.parse(new Date().toISOString())-2685600000).toISOString().slice(0,10);
        this.defaultToDateString = new Date().toISOString().slice(0,10);

        if (this.isUserAdmin) {
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

    getAdminFeedWithoutLimits() {
        this.userProfileService.getNewsFeedOfAdminWithoutLimits().subscribe(newsFeed => {
            this.setAdminFeedString(JSON.stringify(newsFeed, null, 4))
        });
    }

    getAdminFeedWithLimits() {
        var fromAdminFeed = this.adminFeedCursor;
        var toAdminFeed = this.adminFeedCursorLimit + this.adminFeedCursor;
        this.userProfileService.getNewsFeedOfAdmin(fromAdminFeed.toString(), toAdminFeed.toString()).subscribe(
            newsfeed => {
                this.setAdminFeed(newsfeed);
            }
        );
    }

    getAdminFeedWithDates(from = null, to = null) {
        var dateFromValue = from == null ? (<HTMLInputElement>document.getElementById("datefrom")).value : from;
        var dateToValue = to == null ? (<HTMLInputElement>document.getElementById("dateto")).value : to;

        var fromAdminDate = dateFromValue ? Date.parse(dateFromValue).toString() : undefined;
        var toAdminDate = dateToValue ? (Date.parse(dateToValue) + 86398999).toString() : undefined;
        this.userProfileService.getNewsFeedOfAdminWithDates(fromAdminDate, toAdminDate).subscribe(
            newsfeed => {
                this.setAdminFeedString(JSON.stringify(newsfeed, null, 4));
            }
        );
    }
}