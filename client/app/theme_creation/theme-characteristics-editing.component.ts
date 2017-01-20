import {Component, EventEmitter, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {Theme} from "../models/theme";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'app-theme-characteristics-editing',
    templateUrl: 'theme-characteristics-editing.component.html'
})
export class ThemeCharacteristicsEditingComponent {
    @Input() theme: Theme;
    @Input() themeTags: any[];
    @Output() cancelEditing: EventEmitter<boolean> = new EventEmitter<boolean>();

    onSubmit() {
        alert('Submit form')
    }

    notifyCancelEditing() {
        //theme characteristics are no longer editable
        this.cancelEditing.emit(false);
    }
}
