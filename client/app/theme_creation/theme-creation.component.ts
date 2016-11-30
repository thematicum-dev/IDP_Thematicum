import { Component } from '@angular/core';
import {AutoCompleteComponent} from "../autocomplete/autocomplete.component";

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html',
    directives: [AutoCompleteComponent]
})
export class ThemeCreationComponent {
    selectedTags: string[] = ['Tag 1', 'Tag 2'];
    tagsPlaceholder = 'Keyword';

    onNotifySelectedItem(tag: any) {
        alert(tag.name)
    }
}