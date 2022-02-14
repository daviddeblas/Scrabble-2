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
        service = jasmine.createSpyObj('PlayerService', ['surrenderGame']);
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
});
