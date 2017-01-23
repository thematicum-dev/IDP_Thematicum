import {Component} from '@angular/core';
@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    styleUrls: [
        `.modal {
            background: rgba(0,0,0,0.6);
        }`]
})
export class ModalComponent {
    public visible = false;
    private visibleAnimate = false;
    private data: any; //a variable to allow the modal to carry context data

    public setData(contextData: any) {
        this.data = contextData;
    }

    public getData() {
        return this.data;
    }

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true);
    }

    public hide(): void {
        this.visibleAnimate = false;
        this.visible = false;
        //TODO: timetout causes issues
        //setTimeout(() => this.visible = false, 300);
    }
}