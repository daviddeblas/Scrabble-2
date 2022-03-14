/* eslint-disable no-invalid-this */
// Syntaxe utilisé sur le site de ngRx
// Necessaire pour utiliser les actions dans les fichiers .effects, si on enleve la ligne esLint: unexpected this
// Si on enleve le esLint : erreur de TypeScript

import { Injectable } from '@angular/core';
import { loadDictionaries } from '@app/actions/dictionaries.actions';
import { DictionaryService } from '@app/services/dictionary.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class DictionariesEffects {
    loadDictionaries$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loadDictionaries),
                tap(() => {
                    this.dictionaryService.getDictionaries();
                }),
            ),
        { dispatch: false },
        // FeatureActions.actionOne is not dispatched
    );

    constructor(private actions$: Actions, private dictionaryService: DictionaryService) {}
}
