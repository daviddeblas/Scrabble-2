import { ComponentFixture, TestBed } from '@angular/core/testing';
import { exchangeLetters } from '@app/actions/player.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { EaselComponent } from './easel.component';

fdescribe('EaselComponent', () => {
    let component: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EaselComponent],
            imports: [AppMaterialModule],
            providers: [provideMockStore()],
        }).compileComponents();
        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('disableExchange should return false if it is the player turn and there is more than 7 letters in the pot', () => {
        const gameStatus = { activePlayer: 'Player', letterPotLength: 50 } as GameStatus;
        store.overrideSelector('gameStatus', gameStatus);
        store.overrideSelector('players', { player: { name: 'Player' } });
        expect(component.disableExchange()).toBeFalsy();
    });

    it('disableExchange should return true if it is not the player turn', () => {
        const gameStatus = { activePlayer: 'not Player', letterPotLength: 50 } as GameStatus;
        store.overrideSelector('gameStatus', gameStatus);
        store.overrideSelector('players', { player: { name: 'Player' } });
        expect(component.disableExchange()).toBeTrue();
    });

    it('disableExchange should return true there is less than 7 letters in the pot', () => {
        const gameStatus = { activePlayer: 'Player', letterPotLength: 5 } as GameStatus;
        store.overrideSelector('gameStatus', gameStatus);
        store.overrideSelector('players', { player: { name: 'Player' } });
        expect(component.disableExchange()).toBeTrue();
    });

    it('exchangeLetters should dispatch "[Players] Exchange Letters" and call cancelSelection with the selected letters', () => {
        component.letterColor[0] = component.exchangeColor;
        component.letterColor[2] = component.exchangeColor;
        const cancelSelectionSpy = spyOn(component, 'cancelSelection');
        store.overrideSelector('players', { player: { easel: ['A', 'E', '*', 'Z'] } });
        const expectedAction = cold('a', { a: exchangeLetters({ letters: 'a*' }) });
        component.exchangeLetters();
        expect(store.scannedActions$).toBeObservable(expectedAction);
        expect(cancelSelectionSpy).toHaveBeenCalled();
    });

    it('cancelSelection should restore the elements with exchangeColor to mainColor', () => {
        component.letterColor[0] = component.exchangeColor;
        component.letterColor[2] = component.exchangeColor;
        component.letterColor[3] = 'otherColor';
        component.cancelSelection();
        for (let index = 0; index < component.letterColor.length; index++) {
            if (index !== 3) expect(component.letterColor[index]).toEqual(component.mainColor);
            else expect(component.letterColor[index]).toEqual('otherColor');
        }
    });
});
