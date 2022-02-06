import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { RoomEffects } from './room.effects';

describe('RoomEffects', () => {
    let actions$: Observable<unknown>;
    let effects: RoomEffects;

    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RoomEffects,
                provideMockActions(() => actions$),
                provideMockStore(),
                {
                    provide: Router,
                    useValue: routerMock,
                },
            ],
        });

        routerMock = jasmine.createSpyObj('router', ['navigateByUrl']);
        effects = TestBed.inject(RoomEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
