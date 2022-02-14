import { TestBed } from '@angular/core/testing';
import { loadDictionaries } from '@app/actions/dictionaries.actions';
import { DictionaryService } from '@app/services/dictionary.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { DictionariesEffects } from './dictionaries.effects';

describe('DictionariesEffects', () => {
    let actions$: Observable<unknown>;
    let effects: DictionariesEffects;

    let dictionaryService: jasmine.SpyObj<DictionaryService>;

    beforeEach(() => {
        dictionaryService = jasmine.createSpyObj('dictionaryService', ['getDictionaries']);

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
});
