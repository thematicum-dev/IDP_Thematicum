import {Component, EventEmitter} from '@angular/core';
import {Theme} from "../models/theme";
import {Input, Output} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'app-theme-characteristics-editing',
    templateUrl: 'theme-characteristics-editing.component.html'
})
export class ThemeCharacteristicsEditingComponent {
    @Input()theme: Theme;
    @Output()notifyThemeEditing: EventEmitter<Theme> = new EventEmitter<Theme>();

}
