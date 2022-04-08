import { Component } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `<div class="d-flex justify-content-center modal align-items-center">
                <div class="spinner-border" style="color: #550e9b" role="status">
                </div>
              </div>`
})
export class LoadingComponent {
    constructor() { }
}
