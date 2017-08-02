import {Component, Input, OnInit} from '@angular/core';
import {NewsFeedModel} from '../models/newsFeedModel';
@Component({
            selector: 'app-user-newsfeed',
            templateUrl: 'newsfeed.component.html'
})

export class NewsFeedComponent implements OnInit{
            @Input('newsfeed')
            newsfeed: NewsFeedModel;

            ngOnInit(): void{
                        //this.newsfeed = this.newsfeed;
            }
}