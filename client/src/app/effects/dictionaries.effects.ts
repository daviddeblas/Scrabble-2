/* eslint-disable no-invalid-this */
// Syntaxe utilisé sur le site de ngRx
// Necessaire pour utiliser les actions dans les fichiers .effects, si on enleve la ligne esLint: unexpected this
// Si on enleve le esLint : erreur de TypeScript

import { Injectable } from '@angular/core';
import {
    addDictionary,
    deleteDictionary,
    downloadDictionary,
    loadDictionaries,
    modifyDictionary,
    resetDictionaries,
} from '@app/actions/dictionaries.actions';
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

    addDictionaries$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(addDictionary),
                tap(({ dictionary }) => {
                    this.dictionaryService.addDictionary(dictionary);
                }),
            ),
        { dispatch: false },
        // FeatureActions.actionOne is not dispatched
    );

    resetDictionaries$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(resetDictionaries),
                tap(() => {
                    this.dictionaryService.resetDictionaries();
                }),
            ),
        { dispatch: false },
        // FeatureActions.actionOne is not dispatched
    );

    modifyDictionary$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(modifyDictionary),
                tap(({ oldDictionary, newDictionary }) => {
                    this.dictionaryService.modifyDictionary(oldDictionary, newDictionary);
                }),
            ),
        { dispatch: false },
        // FeatureActions.actionOne is not dispatched
    );

    deleteDictionary$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(deleteDictionary),
                tap(({ dictionary }) => {
                    this.dictionaryService.deleteDictionary(dictionary.title);
                }),
            ),
        { dispatch: false },
        // FeatureActions.actionOne is not dispatched
    );

    downloadDictionaries$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(downloadDictionary),
                tap(({ dictionary }) => {
                    this.dictionaryService.downloadDictionary(dictionary);
                }),
            ),
        { dispatch: false },
        // FeatureActions.actionOne is not dispatched
    );

    constructor(private actions$: Actions, private dictionaryService: DictionaryService) {}
}
