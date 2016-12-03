import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Theme} from "../models/theme";
import {ThemeSearchService} from "../theme_search/theme-search.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {timeHorizonValues, maturityValues, categoryValues} from "../theme_creation/themeProperties";

@Component({
    selector: 'app-theme-details',
    templateUrl: 'theme-details.component.html',
    styles: [`h3 {
        margin-top: 0;
    }`],
    providers: [ThemeSearchService]
})
export class ThemeDetailsComponent implements OnInit, OnChanges {
    theme: Theme;
    creationDate: Date;
    description = 'Lorem ipsum dolor sit amet, te qui nihil clita cetero, mei natum porro percipitur te. In qui elitr consul. Duis quando argumentum at eam. Usu adhuc postea ullamcorper no, usu regione singulis ut. Bonorum molestiae vim cu, no mei autem simul cetero. At pro odio audiam. Mea enim everti reformidans cu, id pro dico percipit ocurreret. Pro in duis mucius, fierent facilisis gubergren at eos, vel errem argumentum id. Sumo probo delenit ad qui, ut vix dico summo. Facilis mentitum ei his.';

    timeHorizonValues = timeHorizonValues;
    maturityValues = maturityValues;
    categoryValues = categoryValues;

    isEditMode: boolean = false;

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.searchService.getThemeById(params['id']))
            .subscribe((theme: Theme) => {
                this.theme = theme;
                this.creationDate = new Date(theme.createdAt);
                console.log(this.theme);
            });

        console.log(this.theme)
    }

    ngOnChanges(changes: SimpleChanges): void {
        var themeChange: Theme = changes.theme.currentValue;
        if (themeChange) {
            // this.autocompleteList.list = this.dataSource;
            console.log(this.theme)
        }
    }

    test() {
        if (!this.isEditMode) {
            return false;
        }
        alert('hi');
    }

    constructor(private route: ActivatedRoute, private router: Router, private searchService: ThemeSearchService) { }
}