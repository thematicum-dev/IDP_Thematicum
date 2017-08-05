import {Component, Input, OnInit} from '@angular/core';
import {NewsFeedModel} from '../models/newsFeedModel';
@Component({
            selector: 'app-user-newsfeed',
            templateUrl: 'newsfeed.component.html',
            styles: [`
                        .newsfeeddiv {
                                    border-bottom: 0.5px solid rgb(160,160,255);
                                    border-radius: 3px;
                                    padding: 15px; 
                                    width: auto;
                                    margin-bottom: 5px;
                        }

                        .indent {
                                    margin-left: 20px;
                        }

                        .thick {
                                    font-weight: bold;
                        }

                        .time {
                                    color: #95a5a6;
                                    font-size: 0.8em;
                                    float: right;
                        }
            `]
})

export class NewsFeedComponent implements OnInit{
            @Input('newsfeed')
            newsfeed: NewsFeedModel;

            ngOnInit(): void{
                        this.newsfeed.createdAt = new Date(this.newsfeed.createdAt).toLocaleString();
            }
}