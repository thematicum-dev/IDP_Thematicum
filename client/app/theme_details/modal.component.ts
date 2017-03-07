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
    private visible = false;
    private visibleAnimate = false;
    private data: any; //a variable to allow the modal to carry context data

    setData(contextData: any) {
        this.data = contextData;
    }

    getData(): any {
        return this.data;
    }

    show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true);
    }

    hide(): void {
        this.visibleAnimate = false;
        this.visible = false;
    }
}