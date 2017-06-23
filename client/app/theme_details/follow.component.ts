import { Component, Input, Output, OnInit } from '@angular/core';
import { FollowService } from '../services/follow.service';
//{{!follow && 'Follow' || 'Unfollow'}}
@Component({
  selector: 'app-follow',
  providers: [FollowService],
  template: `<a class="btn center-block" ng-class="{true: 'btn-primary', false: 'btn-danger'}[!patient.archived]" (click)="changeFollow($event, follow)"> <span class="glyphicons glyphicons-star-empty"></span> {{!follow && 'Follow' || 'Unfollow'}} </a>`
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