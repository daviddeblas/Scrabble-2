import { Component } from '@angular/core';
import { GameOptions } from '@app/classes/game-options';
import { Store } from '@ngrx/store';

@Component({
    templateUrl: './solo-game-settings-page.component.html',
    styleUrls: ['./solo-game-settings-page.component.scss'],
})
export class SoloGameSettingsPageComponent {
    constructor(private store: Store) {}

    onGameOptionsSubmit(gameOptions: GameOptions, botName?: string) {
        if (botName) {
            this.store;
            gameOptions;
        }
        return;
    }
}
