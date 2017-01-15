import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-homepage',
    templateUrl: 'homepage.component.html'
})
export class HomepageComponent implements OnInit {
    constructor(private http: Http) { }
    data = {};
    ngOnInit(): void {
        let _var1 = this.http.get('http://localhost:3000/api/test/test1').map(res => res.json());
        let _var2 = this.http.get('http://localhost:3000/api/test/test2').map(res => res.json());

        Observable.forkJoin([_var1, _var2]).subscribe(results => {
            // results[0] is our character
            // results[1] is our character homeworld
            this.data.var1 = results[0];
            this.data.var2 = results[1];
            console.log(this.data);
        });
    }
}