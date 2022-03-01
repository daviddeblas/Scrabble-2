import { Component, Input } from '@angular/core';
import { cellClick } from '@app/actions/board.actions';
import { Vec2 } from '@app/classes/vec2';
import { BoardState } from '@app/reducers/board.reducer';
import { LocalSettings } from '@app/reducers/local-settings.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-cell-empty]',
    templateUrl: './cell-empty.component.html',
    styleUrls: ['./cell-empty.component.scss'],
})
export class CellEmptyComponent {
    @Input() pos: Vec2 = { x: 0, y: 0 };

    selectedPos$: Observable<Vec2 | null>;
    selectedOrientation$: Observable<string>;

    constructor(public store: Store<{ board: BoardState; localSettings: LocalSettings }> /* private elementRef: ElementRef*/) {
        this.selectedPos$ = store.select('board', 'selectedCell');
        this.selectedOrientation$ = store.select('board', 'selectedOrientation');
    }

    click(): void {
        this.store.dispatch(cellClick({ pos: this.pos }));
    }
}
