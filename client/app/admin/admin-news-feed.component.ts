import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NewsFeedModel } from "../models/newsFeedModel";
import { UserProfileService } from '../services/user-profile.service';
import { DataTableResource } from 'angular-4-data-table';
import persons from '../data';
import { UserModel } from "../models/userModel";

@Component({
    selector: 'app-admin-news-feed',
    providers: [UserProfileService],
    templateUrl: 'admin-news-feed.component.html',
})

export class AdminNewsFeed implements OnInit{

    itemResource;
    items = [];
    itemCount = 0;
    users: any;
    parameter;


    constructor(private userProfileService: UserProfileService) {}


    async ngOnInit() {
        this.users = await this.getUsers();
        console.log(this.users);
        this.itemResource = new DataTableResource(this.users.obj);
        this.itemResource.count().then(count => this.itemCount = count);
        this.itemResource.query(this.parameter).then(items => this.items = items);
    }

    getUsers() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.userProfileService.getAllUsers().subscribe(data => resolve(data), error => reject(error));
        })
    }


    reloadItems(params) {
        this.parameter = params;
        this.ngOnInit();
        
    }

    removeUser(event) {

        if(window.confirm('Are sure you want to delete this item ?')){
            this.userProfileService.removeUserById(event._id).subscribe(results => {
                        console.log(results);
                        this.ngOnInit();
                });
        }
        
    }

    rowTooltip(item) { return item.jobTitle; }
}