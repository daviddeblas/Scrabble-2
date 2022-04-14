import { Component } from '@angular/core';
import { resetGameHistory } from '@app/actions/game-history.actions';
import { resetLeaderboard } from '@app/actions/leaderboard.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    constructor(private store: Store) {}

    resetGameHistory(): void {
        this.store.dispatch(resetGameHistory());
    }

    resetLeaderBoard(): void {
        this.store.dispatch(resetLeaderboard());
    }
}
