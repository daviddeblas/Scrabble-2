import { Component } from '@angular/core';
import { Letter } from '@app/classes/letter';
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
    pointsPerLetter$: Observable<[Letter, number][]>;
    players$: Observable<Players>;

    constructor(store: Store<{ board: BoardState; players: Players }>) {
        this.pointsPerLetter$ = store.select('board', 'pointsPerLetter');
        this.players$ = store.select('players');
    }
}
