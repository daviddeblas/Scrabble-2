import { TestBed } from '@angular/core/testing';
import { PlayerService } from '@app/services/player.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { PlayerEffects } from './player.effects';

describe('PlayerEffects', () => {
    let actions$: Observable<unknown>;
    let effects: PlayerEffects;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let service: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PlayerEffects,
                provideMockActions(() => actions$),
                {
                    provide: PlayerService,
                    useValue: jasmine.createSpyObj('PlayerService', ['surrenderGame', 'placeWord']),
                },
            ],
        });
        effects = TestBed.inject(PlayerEffects);
        service = TestBed.inject(PlayerService);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    it('surrenderEffect$ should call the function surrenderGame from player service', (done) => {
        actions$ = of({ type: '[Players] Surrender' });
        effects.surrenderEffect$.subscribe();
        expect(service.surrenderGame).toHaveBeenCalledWith();
        done();
    });

    it('placeWordEffect$ should call the function placeWord from player service', (done) => {
        actions$ = of({ type: '[Players] Place Word' });
        effects.placeWordEffect$.subscribe();
        expect(service.placeWord).toHaveBeenCalled();
        done();
    });
});
