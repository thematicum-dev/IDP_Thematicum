import { Component, Input, Output, OnInit } from '@angular/core';
import { FollowService } from '../services/follow.service';

@Component({
        selector: 'app-follow',
        providers: [FollowService],
        templateUrl: 'follow.component.html',
        styles: [`
        .follow-this-theme {
                width: 128px;
                height: 36px;
                font-family: DroidSans;
                font-size: 16px;
                line-height: 2.25;
                text-align: center;
        }
        .follow-button {
                width: 230px;
                height: 50px;
                border: solid 1px #2980b9;                
                color: #2980b9;
        }
        .unfollow-button {
                width: 230px;
                height: 50px;
                border: solid 1px #ffffff;     
                background-color: #2980b9;          
                color: #ffffff;
        }
  `]
})

export class FollowComponent implements OnInit {

        constructor(private followService: FollowService) { }

        follow: boolean = false;

        @Input('theme')
        theme: string = "Clean Energy";

        reactToData(results) {
                if (results.isFollowing) {
                        this.follow = true;
                } else {
                        this.follow = false;
                }
        }

        ngOnInit(): void {
                this.follow = this.followService.getFollowMock(this.theme);
                this.refresh();
        }

        public refresh() {
                this.followService.getFollow(this.theme).subscribe(results => this.reactToData(results));
        }

        changeFollow($event, follow) {
                if (follow) {
                        this.followService.unfollow(this.theme).subscribe(results => this.reactToData(results));
                } else {
                        this.followService.follow(this.theme).subscribe(results => this.reactToData(results));
                }
        }
}