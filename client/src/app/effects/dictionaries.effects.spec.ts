import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { DictionariesEffects } from './dictionaries.effects';

describe('DictionariesEffects', () => {
    let actions$: Observable<unknown>;
    let effects: DictionariesEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DictionariesEffects, provideMockActions(() => actions$), provideMockStore()],
        });

        effects = TestBed.inject(DictionariesEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
