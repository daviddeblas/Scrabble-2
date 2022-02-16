import { Component } from '@angular/core';
import { messageWritten } from '@app/actions/chat.actions';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-skip-turn-button',
    templateUrl: './skip-turn-button.component.html',
    styleUrls: ['./skip-turn-button.component.scss'],
})
export class SkipTurnButtonComponent {
    players$: Observable<Players>;
    gameStatus$: Observable<GameStatus>;
    username: string;
    activePlayer: string;

    constructor(private store: Store<{ players: Players; gameStatus: GameStatus }>) {
        this.players$ = store.select('players');
        this.players$.subscribe((state) => {
            if (state) this.username = state.player.name;
        });
        this.gameStatus$ = store.select('gameStatus');
        this.gameStatus$.subscribe((state) => {
            if (state) this.activePlayer = state.activePlayer;
        });
    }

    skipTurn(): void {
        this.store.dispatch(messageWritten({ username: this.username, message: '!passer' }));
    }

    isPlayerTurn(): boolean {
        return this.username === this.activePlayer;
    }
}
