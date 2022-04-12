/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import {
    addDictionary,
    deleteDictionary,
    downloadDictionary,
    loadDictionaries,
    modifyDictionary,
    resetDictionaries,
} from '@app/actions/dictionaries.actions';
import { DictionaryService } from '@app/services/dictionary.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Dictionary } from 'common/classes/dictionary';
import { iDictionary } from 'common/interfaces/dictionary';
import { Observable, of } from 'rxjs';
import { DictionariesEffects } from './dictionaries.effects';

describe('DictionariesEffects', () => {
    let actions$: Observable<unknown>;
    let effects: DictionariesEffects;

    let dictionaryService: jasmine.SpyObj<DictionaryService>;

    beforeEach(() => {
        dictionaryService = jasmine.createSpyObj('dictionaryService', [
            'getDictionaries',
            'resetDictionaries',
            'modifyDictionary',
            'deleteDictionary',
            'downloadDictionary',
            'addDictionary',
        ]);

        TestBed.configureTestingModule({
            providers: [
                DictionariesEffects,
                provideMockActions(() => actions$),
                provideMockStore(),
                { provide: DictionaryService, useValue: dictionaryService },
            ],
        });

        effects = TestBed.inject(DictionariesEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    it('loadDictionaries$ should call getDictionaries from dictionary service', () => {
        actions$ = of(loadDictionaries);
        effects.loadDictionaries$.subscribe();
        expect(dictionaryService.getDictionaries).toHaveBeenCalled();
    });

    it('addDictionaries$ should call addDictionary from dictionary service', async () => {
        const dictionary = { title: 'normal', description: 'something' } as iDictionary;
        dictionaryService.addDictionary.and.returnValue(
            new Observable<Dictionary>((observer) => {
                observer.next(dictionary as unknown as Dictionary);
            }),
        );
        const file = {
            text: async () => {
                return new Promise<string>((resolve) => {
                    resolve(JSON.stringify(dictionary));
                });
            },
        };
        actions$ = of(addDictionary({ file: file as File, dictionary }));
        effects.addDictionaries$.subscribe();
        expect(dictionaryService.addDictionary).toHaveBeenCalled();
    });

    it('resetDictionaries$ should call resetDictionaries from dictionary service', () => {
        actions$ = of(resetDictionaries);
        effects.resetDictionaries$.subscribe();
        expect(dictionaryService.resetDictionaries).toHaveBeenCalled();
    });

    it('modifyDictionary$ should call modifyDictionary from dictionary service', () => {
        actions$ = of(modifyDictionary);
        effects.modifyDictionary$.subscribe();
        expect(dictionaryService.modifyDictionary).toHaveBeenCalled();
    });

    it('deleteDictionary$ should call deleteDictionary from dictionary service', () => {
        actions$ = of(deleteDictionary({ dictionary: { title: 'Title' } as iDictionary }));
        effects.deleteDictionary$.subscribe();
        expect(dictionaryService.deleteDictionary).toHaveBeenCalled();
    });

    it('downloadDictionaries$ should call downloadDictionaries from dictionary service', () => {
        actions$ = of(downloadDictionary);
        effects.downloadDictionaries$.subscribe();
        expect(dictionaryService.downloadDictionary).toHaveBeenCalled();
    });
});
