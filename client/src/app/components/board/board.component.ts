import { Component, OnInit } from '@angular/core';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
    gameStatus$: Observable<GameStatus>;

    constructor(store: Store<{ gameStatus: GameStatus }>) {
        this.gameStatus$ = store.select('gameStatus');
    }

    ngOnInit(): void {}
}
