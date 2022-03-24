import { Component, OnInit } from '@angular/core';
import { browserReload } from '@app/actions/browser.actions';
import { getGameStatus } from '@app/actions/game-status.actions';
import { ObjectiveManagerService } from '@app/services/objective-manager.service';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    isLog2990: boolean = true;
    constructor(private store: Store, private objectiveService: ObjectiveManagerService) {
        store.dispatch(getGameStatus());
        window.addEventListener('load', (event) => this.catchBrowserLoad(event));
    }

    ngOnInit() {
        this.objectiveService.mode.subscribe((message) => (this.isLog2990 = message));
    }

    catchBrowserLoad(event: Event) {
        event.preventDefault();
        this.store.dispatch(browserReload());
    }
}
