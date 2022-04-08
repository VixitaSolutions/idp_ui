import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    styleUrls: ['./confirmation-modal.component.scss'],
    template: `
  <clr-modal [(clrModalOpen)]="open">
  <div id="open-modal" class="modal">
  <div class="modal-content">
    <h2 class="modal-title">{{title}}</h2>
    <div class="modal-body container">
      <p>{{text}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline" *ngIf="cancel" (click)="Clicked(false)">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="Clicked(true)">Ok</button>
    </div>
    </div>
    </div>
  </clr-modal>`
})
export class ConfirmationModalComponent {
    destroy$: Subject<boolean> = new Subject();

    open: boolean;
    title: string;
    text: string;
    cancel: boolean;

    constructor() { }

    Clicked(result): void {
        this.open = false;
        this.destroy$.next(result);
    }
}
