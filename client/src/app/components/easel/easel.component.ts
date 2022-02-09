import { Component } from '@angular/core';
import { BoardState } from '@app/reducers/board.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    boardState$: Observable<BoardState>;
    players$: Observable<Players>;

    constructor(store: Store<{ boardState: BoardState; players: Players }>) {
        this.boardState$ = store.select('boardState');
        this.players$ = store.select('players');
    }
}
