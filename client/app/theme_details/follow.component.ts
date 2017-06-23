import { Component, Input, Output, OnInit } from '@angular/core';
import { FollowService } from '../services/follow.service';
//{{!follow && 'Follow' || 'Unfollow'}}
@Component({
  selector: 'app-follow',
  providers: [FollowService],
  template: `<a class="btn center-block" ng-class="{true: 'btn-primary', false: 'btn-danger'}[!patient.archived]" > <span class="glyphicons glyphicons-star-empty"></span> {{!follow && 'Follow' || 'Unfollow'}} </a>`
})

export class FollowComponent implements OnInit{

            constructor(private followService: FollowService) { }

            follow: boolean = false;

            @Input('theme')
            theme: string = "Clean Energy";

            ngOnInit(): void{
                        this.follow = this.followService.getFollowMock(this.theme);
                        this.followService.getFollowReal(this.theme).subscribe(results => {
                            console.log("theme following data");
                            console.log(results);
                            if (results.isFollowing){
                                this.follow = true;
                            }else{
                                this.follow = false;
                            }
                        });
            }

            onclick(){
                    if(this.follow){

                    }else{
                        
                    }
            }
}