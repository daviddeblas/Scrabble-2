import { Component, OnInit } from '@angular/core';
import { GameState } from '@app/reducers/game.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
    gameState$: Observable<GameState>;

    constructor(store: Store<{ game: GameState }>) {
        this.gameState$ = store.select('game');
    }

    ngOnInit(): void {}
}
