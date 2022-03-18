import { TestBed } from '@angular/core/testing';
import { PlayerService } from '@app/services/player.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { PlayerEffects } from './player.effects';

describe('PlayerEffects', () => {
    let actions$: Observable<unknown>;
    let effects: PlayerEffects;
    let service: jasmine.SpyObj<PlayerService>;

    beforeEach(() => {
        service = jasmine.createSpyObj('PlayerService', ['surrenderGame', 'placeWord', 'exchangeLetters']);
        TestBed.configureTestingModule({
            providers: [
                PlayerEffects,
                provideMockActions(() => actions$),
                {
                    provide: PlayerService,
                    useValue: service,
                },
            ],
        });
        effects = TestBed.inject(PlayerEffects);
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

    it('resetSocketConnection$ should call the function resetConnection from socket service', (done) => {
        // eslint-disable-next-line dot-notation
        const resetSocketSpy = spyOn(effects['socketService'], 'resetConnection');
        actions$ = of({ type: '[Players] Reset Socket Connection' });
        effects.resetSocketConnection$.subscribe();
        expect(resetSocketSpy).toHaveBeenCalledWith();
        done();
    });

    it('placeWordEffect$ should call the function placeWord from player service', (done) => {
        actions$ = of({ type: '[Players] Place Word' });
        effects.placeWordEffect$.subscribe();
        expect(service.placeWord).toHaveBeenCalled();
        done();
    });

    it('exchangeLettersEffect$ should call the function exchangeLetters from player service', (done) => {
        actions$ = of({ type: '[Players] Exchange Letters' });
        effects.exchangeLettersEffect$.subscribe();
        expect(service.exchangeLetters).toHaveBeenCalled();
        done();
    });
});
