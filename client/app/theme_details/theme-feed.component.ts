
import {Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {Theme} from "../models/theme";
import {ActivatedRoute, Router} from '@angular/router';
import {ThemeService} from "../services/theme.service";
import {Location,DatePipe} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

declare var trends: any;

@Component({
    selector: 'app-theme-feed',
    templateUrl: 'theme-feed.component.html',
    
    providers:[DatePipe]
    

})

export class ThemeFeedComponent implements OnInit {
    name: string;
    modifiedName: any;
    @Input() themeId: string;
    @Input() theme: Theme;
    data: any;

    // colorCodes = ['rgb(0,0,0)','rgb(255,0,0)','rgb(0,255,0)','rgb(0,0,255)','rgb(255,255,0)','rgb(255,0,255)','rgb(128,0,0)','rgb(128,0,128)','rgb(0,0,128)','rgb(128,128,128)'];
    colorCodes = ['rgb(39,174,96)','rgb(26,188,156)','rgb(41,128,185)','rgb(155,89,182)','rgb(192,57,43)','rgb(0,0,0)','rgb(255,0,0)','rgb(0,255,0)','rgb(0,0,255)','rgb(255,255,0)'];

    lineChartData: any = [{ 
            data: []
        }];

    lineChartLabels: any = [];

    lineChartColors: any = [];

    constructor(private route: ActivatedRoute, private router: Router, private themeService: ThemeService, private location: Location, private sanitizer: DomSanitizer, private datePipe: DatePipe) { 
        
    }
    
    ngOnInit(): void {

        this.name = this.theme.name


        this.themeService.getAllTrends(this.theme).subscribe(
            result => {
                console.log(result);

                this.data = result;


                this.lineChartData = [];
                for(var i=0; i<result.value.length; i++) {
                    this.lineChartData.push({data: result.value[i].value, label: result.value[i].trendName});
                    if(i<=9) {

                        this.lineChartColors.push({borderColor: this.colorCodes[i], pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff'})
                    } else {
                        this.lineChartColors.push({borderColor: this.colorCodes[9], pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff'})
                    }
                }
                

                this.lineChartLabels = result.timeline;                      

                //display the results nicely
            },
            error => console.log('Error: ', error));
        
            
    }

    


  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
  public lineChartOptions:any = {
    scales: {
        xAxes: [{
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            gridLines: {
                display:false
            }   
        }]
    },
    responsive: true
  };

  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }   



}