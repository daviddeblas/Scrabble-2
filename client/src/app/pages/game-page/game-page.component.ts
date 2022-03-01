import { Component, HostListener } from '@angular/core';
import { getGameStatus } from '@app/actions/game-status.actions';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { KeyManagerService } from '@app/services/key-manager.service';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private store: Store<GameStatus>, private keyManager: KeyManagerService) {
        this.store.dispatch(getGameStatus());
    }
    @HostListener('window:keydown', ['$event'])
    handleKeyDown(e: KeyboardEvent): void {
        this.keyManager.onKey(e.key);
    }
}
