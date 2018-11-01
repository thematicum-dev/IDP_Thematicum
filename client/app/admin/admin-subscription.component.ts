import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';


@Component({
    selector: 'app-admin-subscription',
    providers: [UserProfileService],
    templateUrl: 'admin-subscription.component.html',
})

export class AdminSubscription implements OnInit{

    inputValue: string;

    constructor(private userProfileService: UserProfileService) {}


    ngOnInit() {
        console.log("subscription tab ma chiryo hai!");
    }

    sendSubscriptionEmail() {
        console.log(this.inputValue);
        this.userProfileService.sendSubscribersEmail(this.inputValue).subscribe(results => {
                        console.log(results);
                });
    }
}