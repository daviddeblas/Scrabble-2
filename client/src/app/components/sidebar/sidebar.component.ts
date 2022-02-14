import { Component } from '@angular/core';
import { zoomIn, zoomOut } from '@app/actions/local-settings.actions';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    players$: Observable<Players>;
    gameStatus$: Observable<GameStatus>;

    constructor(private store: Store<{ players: Players; gameStatus: GameStatus }>) {
        this.players$ = store.select('players');
        this.gameStatus$ = store.select('gameStatus');
    }

    zoomIn() {
        this.store.dispatch(zoomIn());
    }

    zoomOut() {
        this.store.dispatch(zoomOut());
    }
}
