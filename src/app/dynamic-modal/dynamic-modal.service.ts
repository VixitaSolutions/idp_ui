import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IConfirmationModal } from './confirmation-modal.model';

import { take, tap, takeLast, takeUntil, first } from 'rxjs/operators';
import { ConfirmationModalComponent } from './confirmation-modal.component';

@Injectable({
    providedIn: 'root'
})

export class DynamicModalService {
    vcr: ViewContainerRef;
    constructor(private cfr: ComponentFactoryResolver) { }

    setViewContainerRef(vcr: ViewContainerRef): void {
        this.vcr = vcr;
    }
    openConfirmationModal(input: IConfirmationModal): any {
        const factory = this.cfr.resolveComponentFactory(ConfirmationModalComponent);
        const ref = factory.create(this.vcr.parentInjector);
        // Access component instance
        (ref.instance as IConfirmationModal).title = input.title;
        (ref.instance as IConfirmationModal).text = input.text;
        (ref.instance as IConfirmationModal).open = true;
        (ref.instance as IConfirmationModal).cancel = input.cancel;
        // Play nice with detection changes
        setTimeout(() => this.vcr.insert(ref.hostView));
        return (ref.instance as IConfirmationModal)
            .destroy$.asObservable()
            .pipe(
                take(1),
                tap(() => ref.destroy())
            )
            .toPromise();
    }
}
