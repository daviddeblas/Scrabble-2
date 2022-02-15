import { Component } from '@angular/core';
import { browserReload, browserUnload } from '@app/actions/browser.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private store: Store) {
        window.addEventListener('beforeunload', this.catchBrowserReload);
        window.addEventListener('load', this.catchBrowserLoad);
    }

    catchBrowserReload(event: Event) {
        event.preventDefault();
        this.store.dispatch(browserUnload());
    }

    catchBrowserLoad(event: Event) {
        event.preventDefault();
        this.store.dispatch(browserReload());
    }
}
