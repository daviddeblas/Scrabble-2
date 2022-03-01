/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { keyDown } from '@app/actions/board.actions';
import { KeyManagerService } from '@app/services/key-manager.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class BoardEffects {
    $keyDown = createEffect(
        () =>
            this.actions$.pipe(
                ofType(keyDown),
                tap((action) => {
                    this.keyManager.onKey(action.key);
                }),
            ),
        { dispatch: false },
    );

    constructor(private actions$: Actions, private keyManager: KeyManagerService) {}
}
