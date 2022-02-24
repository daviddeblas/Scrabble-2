import { ComponentFixture, TestBed } from '@angular/core/testing';
import { exchangeLetters, switchLettersEasel } from '@app/actions/player.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { EaselComponent } from './easel.component';

describe('EaselComponent', () => {
    const exampleEasel = ['A', 'B', 'C', 'D'];
    let component: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;
    let mouseClickStub: MouseEvent;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EaselComponent],
            imports: [AppMaterialModule],
            providers: [provideMockStore()],
        }).compileComponents();
        mouseClickStub = {
            preventDefault: () => {
                return;
            },
        } as unknown as MouseEvent;
        store = TestBed.inject(MockStore);
        store.overrideSelector('players', { player: { name: 'Player', easel: exampleEasel } });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('gameIsEnded should return true if the game is ended and call cancelExchangeSelection', () => {
        store.overrideSelector('gameStatus', { gameEnded: true });
        const cancelExchangeSelectionSpy = spyOn(component, 'cancelExchangeSelection');
        expect(component.gameIsEnded()).toBeTruthy();
        expect(cancelExchangeSelectionSpy).toHaveBeenCalled();
    });

    it('gameIsEnded should return false if the game is not ended', () => {
        store.overrideSelector('gameStatus', { gameEnded: false });
        expect(component.gameIsEnded()).toBeFalsy();
    });

    it('should call event.preventDefault when selectLetterToSwitch is called', () => {
        store.overrideSelector('gameStatus', { gameEnded: false });
        const spy = spyOn(mouseClickStub, 'preventDefault');
        component.selectLetterToSwitch(mouseClickStub, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('should test if the letter selected has the main color', () => {
        store.overrideSelector('gameStatus', { gameEnded: false });
        component.letterColor[0] = component.exchangeColor;
        component.selectLetterToSwitch(mouseClickStub, 0);
        expect(component.letterColor[0]).toEqual(component.mainColor);
    });

    it('cancelSelection should call cancelExchangeSelection and cancelManipulationSelection', () => {
        const exchangeSpy = spyOn(component, 'cancelExchangeSelection');
        const manipulationSpy = spyOn(component, 'cancelManipulationSelection');
        component.cancelSelection();
        expect(exchangeSpy).toHaveBeenCalled();
        expect(manipulationSpy).toHaveBeenCalled();
    });

    it('should test if the letter selected has the exchange color and call cancelManipulationSelection', () => {
        const manipulationSpy = spyOn(component, 'cancelManipulationSelection');
        store.overrideSelector('gameStatus', { gameEnded: false });
        component.letterColor[0] = '';
        component.selectLetterToSwitch(mouseClickStub, 0);
        expect(component.letterColor[0]).toEqual(component.exchangeColor);
        expect(manipulationSpy).toHaveBeenCalled();
    });

    it('selectLetterToSwitch should call cancelSelection if gameEnded is true', () => {
        store.overrideSelector('gameStatus', { gameEnded: true });
        const cancelSelectionSpy = spyOn(component, 'cancelSelection');
        component.selectLetterToSwitch(mouseClickStub, 0);
        expect(cancelSelectionSpy).toHaveBeenCalled();
    });

    it('should test if the letter color has exchange color', () => {
        component.letterColor[0] = component.exchangeColor;
        expect(component.exchangeLetterSelected()).toBeTruthy();
    });

    it('should test if the letter color does not include exchange color', () => {
        component.letterColor[0] = '';
        expect(component.exchangeLetterSelected()).toBeFalsy();
    });

    it('switchColorPosition should switch two color position', () => {
        component.letterColor[0] = 'FirstColor';
        component.letterColor[1] = 'SecondColor';
        component.switchColorPosition(0, 1);
        expect(component.letterColor[0]).toEqual('SecondColor');
        expect(component.letterColor[1]).toEqual('FirstColor');
    });

    it('handlePositionSwitch should call switchColorPosition and dispatch switchLettersEasel when movedRight', () => {
        component.letterColor[0] = component.manipulationColor;
        const switchColorSpy = spyOn(component, 'switchColorPosition');
        const expectedAction = cold('a', { a: switchLettersEasel({ positionIndex: 0, destinationIndex: 1 }) });
        component.handlePositionSwitch(true);
        expect(switchColorSpy).toHaveBeenCalled();
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('handlePositionSwitch should call switchColorPosition and dispatch switchLettersEasel when moved Left', () => {
        component.letterColor[1] = component.manipulationColor;
        const switchColorSpy = spyOn(component, 'switchColorPosition');
        const expectedAction = cold('a', { a: switchLettersEasel({ positionIndex: 1, destinationIndex: 0 }) });
        component.handlePositionSwitch(false);
        expect(switchColorSpy).toHaveBeenCalled();
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('handlePositionSwitch should call dispatch switchLettersEasel when moved left at the edge of easel', () => {
        component.letterColor[0] = component.manipulationColor;
        const expectedAction = cold('a', { a: switchLettersEasel({ positionIndex: 0, destinationIndex: exampleEasel.length - 1 }) });
        component.handlePositionSwitch(false);
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('handlePositionSwitch should call dispatch switchLettersEasel when moved right at the edge of easel', () => {
        component.letterColor[exampleEasel.length - 1] = component.manipulationColor;
        const expectedAction = cold('a', { a: switchLettersEasel({ positionIndex: exampleEasel.length - 1, destinationIndex: 0 }) });
        component.handlePositionSwitch(true);
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('handlePositionSwitch should not call dispatch switchLettersEasel when no letters are selected for manipulation', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.handlePositionSwitch(false);
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('disableExchange should return false if it is the player turn and there is more than 7 letters in the pot', () => {
        const gameStatus = { activePlayer: 'Player', letterPotLength: 50, gameEnded: false } as GameStatus;
        store.overrideSelector('gameStatus', gameStatus);
        expect(component.disableExchange()).toBeFalsy();
    });

    it('disableExchange should return true if it is not the player turn', () => {
        const gameStatus = { activePlayer: 'not Player', letterPotLength: 50, gameEnded: false } as GameStatus;
        store.overrideSelector('gameStatus', gameStatus);
        expect(component.disableExchange()).toBeTrue();
    });

    it('disableExchange should return true if there is less than 7 letters in the pot', () => {
        const gameStatus = { activePlayer: 'Player', letterPotLength: 5, gameEnded: false } as GameStatus;
        store.overrideSelector('gameStatus', gameStatus);
        expect(component.disableExchange()).toBeTrue();
    });

    it('disableExchange should return true if the game is ended', () => {
        const gameStatus = { activePlayer: 'Player', letterPotLength: 50, gameEnded: true } as GameStatus;
        store.overrideSelector('gameStatus', gameStatus);
        expect(component.disableExchange()).toBeTrue();
    });

    it('exchangeLetters should dispatch "[Players] Exchange Letters" and call cancelExchangeSelection with the selected letters', () => {
        component.letterColor[0] = component.exchangeColor;
        component.letterColor[2] = component.exchangeColor;
        const cancelExchangeSelectionSpy = spyOn(component, 'cancelExchangeSelection');
        store.overrideSelector('players', { player: { easel: ['A', 'E', '*', 'Z'] } });
        const expectedAction = cold('a', { a: exchangeLetters({ letters: 'a*' }) });
        component.exchangeLetters();
        expect(store.scannedActions$).toBeObservable(expectedAction);
        expect(cancelExchangeSelectionSpy).toHaveBeenCalled();
    });

    it('cancelExchangeSelection should restore the elements with exchangeColor to mainColor', () => {
        component.letterColor[0] = component.exchangeColor;
        component.letterColor[2] = component.exchangeColor;
        component.letterColor[3] = 'otherColor';
        component.cancelExchangeSelection();
        for (let index = 0; index < component.letterColor.length; index++) {
            if (index !== 3) expect(component.letterColor[index]).toEqual(component.mainColor);
            else expect(component.letterColor[index]).toEqual('otherColor');
        }
    });

    it('cancelManipulationSelection should restore the elements with manipulationColor to mainColor', () => {
        component.letterColor[0] = component.manipulationColor;
        component.letterColor[2] = component.exchangeColor;
        component.cancelManipulationSelection();
        for (let index = 0; index < component.letterColor.length; index++) {
            if (index !== 2) expect(component.letterColor[index]).toEqual(component.mainColor);
            else expect(component.letterColor[index]).toEqual(component.exchangeColor);
        }
    });

    it('selectLetterForManipulation should call cancelSelection and change the color if game is not ended', () => {
        store.overrideSelector('gameStatus', { gameEnded: false });
        const cancelSelectionSpy = spyOn(component, 'cancelSelection');
        component.letterColor[0] = 'otherColor';
        component.selectLetterForManipulation(0);
        expect(cancelSelectionSpy).toHaveBeenCalled();
        expect(component.letterColor[0]).toEqual(component.manipulationColor);
    });

    it('selectLetterForManipulation should not call cancelSelection if game is ended', () => {
        spyOn(component, 'gameIsEnded').and.callFake(() => {
            return true;
        });
        const cancelSelectionSpy = spyOn(component, 'cancelSelection');
        component.selectLetterForManipulation(0);
        expect(cancelSelectionSpy).toHaveBeenCalledTimes(0);
    });
});
