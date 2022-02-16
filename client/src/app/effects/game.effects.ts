/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { getGameStatus } from '@app/actions/game-status.actions';
import { GameManagerService } from '@app/services/game-manager.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class GameEffects {
    getGameStatus$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(getGameStatus),
                tap(() => {
                    this.gameManager.getGameStatus();
                }),
            ),
        { dispatch: false },
    );

    constructor(private actions$: Actions, private gameManager: GameManagerService) {}
}
