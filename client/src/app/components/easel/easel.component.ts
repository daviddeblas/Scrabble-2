import { Component } from '@angular/core';
import { BoardState } from '@app/reducers/board.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    boardState$: Observable<BoardState>;

    constructor(store: Store<{ boardState: BoardState }>) {
        this.boardState$ = store.select('boardState');
    }
}
