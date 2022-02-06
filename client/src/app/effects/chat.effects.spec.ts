import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { ChatEffects } from './chat.effects';

describe('RoomEffects', () => {
    let actions$: Observable<unknown>;
    let effects: ChatEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ChatEffects, provideMockActions(() => actions$)],
        });

        effects = TestBed.inject(ChatEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
