import { Component } from '@angular/core';
import { startNewRound } from '@app/actions/game-status.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private store: Store) {}

    async dispatchTest(): Promise<void> {
        for (let i = 0; i < 100; i++) {
            this.store.dispatch(startNewRound({ activePlayer: 'test' + i }));
        }
    }

    ngOnInit(): void {
        this.dispatchTest();
    }
}
