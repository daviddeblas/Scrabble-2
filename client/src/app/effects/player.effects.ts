/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { surrender } from '@app/actions/player.actions';
import { PlayerService } from '@app/services/player.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class PlayerEffects {
    surrenderEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(surrender),
                tap(() => {
                    this.playerService.surrenderGame();
                }),
            ),
        { dispatch: false },
    );

    constructor(private actions$: Actions, private playerService: PlayerService) {}
}
