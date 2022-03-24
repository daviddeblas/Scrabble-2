import { Component } from '@angular/core';
import { changeGameMode } from '@app/actions/game-status.actions';
import { Store } from '@ngrx/store';
import { GameMode } from 'common/interfaces/game-mode';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(private store: Store) {}

    classicModeChosen(): void {
        this.store.dispatch(changeGameMode({ gameMode: GameMode.Classical }));
    }

    log2990ModeChosen(): void {
        this.store.dispatch(changeGameMode({ gameMode: GameMode.Log2990 }));
    }
}
