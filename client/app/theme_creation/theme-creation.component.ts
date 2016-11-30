import { Component } from '@angular/core';
import {AutoCompleteComponent} from "../autocomplete/autocomplete.component";

@Component({
    selector: 'app-theme-create',
    templateUrl: 'theme-creation.component.html',
    directives: [AutoCompleteComponent]
})
export class ThemeCreationComponent {
    selectedTags: string[] = [];
    tagsPlaceholder = 'Keyword';

    onNotifySelectedItem(tag: any) {
        this.selectedTags.push(tag.name)
    }

    // onTagClick() {
    //     alert('tag click')
    // }

    onTagDeselect(index: number) {
        if (index >= 0 && index < this.selectedTags.length) {
            this.selectedTags.splice(index, 1);
        } else {
            alert('wtf')
        }
    }
}