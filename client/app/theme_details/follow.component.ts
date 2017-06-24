import { Component, Input, Output, OnInit } from '@angular/core';
import { FollowService } from '../services/follow.service';
//{{!follow && 'Follow' || 'Unfollow'}}
@Component({
  selector: 'app-follow',
  providers: [FollowService],
  template: `<a class="btn center-block Follow-button" ng-class="{true: 'btn-primary', false: 'btn-danger'}[!patient.archived]" (click)="changeFollow($event, follow)"> <span class="Follow-this-theme">{{!follow && 'Follow this theme' || 'Unfollow this theme'}}</span></a>`,
  styles: [`
        .Follow-this-theme {
                width: 128px;
                height: 36px;
                font-family: DroidSans;
                font-size: 16px;
                line-height: 2.25;
                text-align: center;
                color: #2980b9;
        }
        .Follow-button {
                width: 230px;
                height: 50px;
                border: solid 1px #2980b9;
        }
  `]
})

export class FollowComponent implements OnInit{

            constructor(private followService: FollowService) { }

            follow: boolean = false;

            @Input('theme')
            theme: string = "Clean Energy";

            reactToData(results){
                if (results.isFollowing){
                        this.follow = true;
                }else{
                        this.follow = false;
                }
            }

            ngOnInit(): void{
                        this.follow = this.followService.getFollowMock(this.theme);
                        this.followService.getFollow(this.theme).subscribe(results => this.reactToData(results));
            }

            changeFollow($event, follow){
                    if(follow){
                            this.followService.unfollow(this.theme).subscribe(results => this.reactToData(results));
                    }else{
                        this.followService.follow(this.theme).subscribe(results => this.reactToData(results));
                    }
            }
}