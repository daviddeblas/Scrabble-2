import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { removeLetterFromEasel } from '@app/actions/player.actions';
import { BoardSelection } from '@app/classes/board-selection';
import { Direction } from '@app/enums/direction';
import { createEmptyMatrix } from '@app/reducers/board.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Vec2 } from 'common/classes/vec2';
import { BOARD_SIZE } from 'common/constants';
import { cold } from 'jasmine-marbles';
import { KeyManagerService } from './key-manager.service';
import { PlayerService } from './player.service';

describe('KeyManagerService', () => {
    let service: KeyManagerService;
    let store: MockStore;
    let mockDocument: { activeElement: { nodeName: string } };

    beforeEach(() => {
        mockDocument = { activeElement: { nodeName: 'NOTBODY' } };
        TestBed.configureTestingModule({
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: 'board',
                            value: {
                                board: createEmptyMatrix({ x: 15, y: 15 }),
                                selection: new BoardSelection(new Vec2(0, 2), Direction.HORIZONTAL, [new Vec2(0, 0), new Vec2(0, 1)]),
                            },
                        },
                    ],
                }),
                { provide: DOCUMENT, useValue: mockDocument },
                {
                    provide: PlayerService,
                    useValue: {
                        getEasel: () => {
                            return ['A', 'B', '*'];
                        },
                    },
                },
            ],
        });
        service = TestBed.inject(KeyManagerService);
        store = TestBed.inject(MockStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("onKey shouldn't do anything if the board selection cell is null", () => {
        store.overrideSelector('board', { selection: new BoardSelection() });
        const dispatchSpy = spyOn(store, 'dispatch');

        service.onKey('a');
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('onKey should the right method if receiving Enter, Escape or Backspace', () => {
        const enterSpy = spyOn(service, 'onEnter');
        service.onKey('Enter');
        expect(enterSpy).toHaveBeenCalled();

        const escSpy = spyOn(service, 'onEsc');
        service.onKey('Escape');
        expect(escSpy).toHaveBeenCalled();

        const backspaceSpy = spyOn(service, 'onBackspace');
        service.onKey('Backspace');
        expect(backspaceSpy).toHaveBeenCalled();
    });

    it("onKey shouldn't do anything if receiving a key longer than 1 char that isn't enter, escape of backspace", () => {
        const dispatchSpy = spyOn(store, 'dispatch');

        service.onKey('Shift');
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("onKey shouldn't do anything if the selection is filed with a letter and is at board limit", () => {
        const customBoard = createEmptyMatrix({ x: BOARD_SIZE, y: BOARD_SIZE });
        customBoard[BOARD_SIZE - 1][0] = 'a';

        store.overrideSelector('board', {
            board: customBoard,
            selection: new BoardSelection(new Vec2(BOARD_SIZE - 1, 0), Direction.HORIZONTAL, [new Vec2(BOARD_SIZE - 1, 0)]),
        });

        const dispatchSpy = spyOn(store, 'dispatch');

        service.onKey('a');
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("onKey shouldn't do anything if the letter is not in the player easel", () => {
        const dispatchSpy = spyOn(store, 'dispatch');

        service.onKey('z');
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('onKey should dispatch placeLetter and removeLetterFromEasel', () => {
        service.onKey('a');

        const expectedAction = cold('a', { a: removeLetterFromEasel({ letter: 'A' }) });

        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('onKey should convert letters with accent to their counterpart without accents', () => {
        service.onKey('à');

        const expectedAction = cold('a', { a: removeLetterFromEasel({ letter: 'A' }) });

        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('onKey should convert letters with accent to their counterpart without accents', () => {
        service.onKey('à');

        const expectedAction = cold('a', { a: removeLetterFromEasel({ letter: 'A' }) });

        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('onKey should add the blank to the service blank list', () => {
        service.onKey('G');

        const expectedAction = cold('a', { a: removeLetterFromEasel({ letter: '*' }) });

        expect(store.scannedActions$).toBeObservable(expectedAction);
        expect(service.blankLettersBuffer.length > 0).toBeTruthy();
        expect(service.blankLettersBuffer[0]).toEqual('G');
    });
});
