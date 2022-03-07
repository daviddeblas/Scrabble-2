import { Component } from '@angular/core';
import { createSoloRoom } from '@app/actions/room.actions';
import { GameOptions } from '@app/classes/game-options';
import { Store } from '@ngrx/store';

@Component({
    templateUrl: './solo-game-settings-page.component.html',
    styleUrls: ['./solo-game-settings-page.component.scss'],
})
export class SoloGameSettingsPageComponent {
    constructor(private store: Store) {}

    onGameOptionsSubmit(gameOptions: GameOptions, botLevel?: string) {
        if (botLevel !== undefined) this.store.dispatch(createSoloRoom({ gameOptions, botLevel }));
    }
}
