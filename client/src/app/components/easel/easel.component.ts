import { Component } from '@angular/core';
import { BoardState } from '@app/reducers/board.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Letter } from 'common/classes/letter';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    pointsPerLetter$: Observable<Map<Letter, number>>;
    players$: Observable<Players>;

    constructor(store: Store<{ board: BoardState; players: Players }>) {
        this.pointsPerLetter$ = store.select('board', 'pointsPerLetter');
        this.players$ = store.select('players');
    }
}
