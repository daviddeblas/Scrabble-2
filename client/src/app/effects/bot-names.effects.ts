/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { loadBotNames } from '@app/actions/bot-names.actions';
import { BotNamesService } from '@app/services/bot-names.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class BotNamesEffects {
    loadBotNames$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loadBotNames),
                tap(() => {
                    this.botNamesService.getBotNames();
                }),
            ),
        { dispatch: false },
        // FeatureActions.actionOne is not dispatched
    );

    constructor(private actions$: Actions, private botNamesService: BotNamesService) {}
}
