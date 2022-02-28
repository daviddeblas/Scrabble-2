/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { receivedMessage } from '@app/actions/chat.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Direction, Word } from '@app/classes/word';
import { BOARD_SIZE } from '@app/constants';
import { SocketTestHelper } from '@app/helper/socket-test-helper';
import { BoardState } from '@app/reducers/board.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { Socket } from 'socket.io-client';
import { PlayerService } from './player.service';
import { SocketClientService } from './socket-client.service';

const CENTER_BOARD = 7;

describe('PlayerService', () => {
    let service: PlayerService;
    let socketService: SocketTestHelper;
    let store: MockStore<{ board: BoardState }>;
    let board: (Letter | null)[][];
    let position: string;
    let word: string;
    beforeEach(async () => {
        word = 'word';
        board = new Array(BOARD_SIZE);
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = new Array(BOARD_SIZE);
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = null;
            }
        }
        board[1][1] = 'A';
        board[14][14] = 'E';

        socketService = new SocketTestHelper();
        const boardState: BoardState = { board, pointsPerLetter: new Map(), multipliers: [], blanks: [] };
        await TestBed.configureTestingModule({
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: 'board',
                            value: boardState,
                        },
                        {
                            selector: 'players',
                            value: { player: { easel: ['A', 'B', 'C', '*'] } },
                        },
                    ],
                }),
            ],
        }).compileComponents();
        TestBed.inject(SocketClientService).socket = socketService as unknown as Socket;
        store = TestBed.inject(MockStore);
        service = TestBed.inject(PlayerService);
        store.refreshState();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send "get game status" to the socket', () => {
        const sendSpy = spyOn(socketService, 'emit');

        service.surrenderGame();

        expect(sendSpy).toHaveBeenCalledWith('surrender game');
    });

    it('placeWord should dispatch placeWordSuccess if the placement is acceptable with direction', () => {
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return true;
        });
        const dispatchSpy = spyOn(service['boardStore'], 'dispatch');
        position = 'h7h';
        service.placeWord(position, word);
        const expectedWord = new Word('word', { x: 6, y: 7 } as Vec2, Direction.HORIZONTAL);
        expect(dispatchSpy).toHaveBeenCalledWith(placeWordSuccess({ word: expectedWord }));
    });

    it('placeWord should dispatch placeWordSuccess if the placement is acceptable with a letter already in place', () => {
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return true;
        });
        const dispatchSpy = spyOn(service['boardStore'], 'dispatch');
        position = 'a2v';
        service.placeWord(position, word);
        const expectedWord = new Word('waord', { x: 1, y: 0 } as Vec2, Direction.VERTICAL);
        expect(dispatchSpy).toHaveBeenCalledWith(placeWordSuccess({ word: expectedWord }));
    });

    it('placeWord should dispatch placeWordSuccess if the placement is acceptable without direction', () => {
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return true;
        });
        const dispatchSpy = spyOn(service['boardStore'], 'dispatch');
        position = 'h8';
        word = 'w';
        service.placeWord(position, word);
        const expectedWord = new Word('w', { x: 7, y: 7 } as Vec2, Direction.HORIZONTAL);
        expect(dispatchSpy).toHaveBeenCalledWith(placeWordSuccess({ word: expectedWord }));
    });

    it('placeWord should dispatch receivedMessage if word is not placable', () => {
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return true;
        });
        position = 'c3';
        service.placeWord(position, word);
        const expectedAction = cold('a', {
            a: receivedMessage({ username: '', message: 'Erreur de syntaxe: commande placer mal formée', messageType: 'Error' }),
        });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('placeWord should dispatch receivedMessage if word is not placable because it extends out of the board horizontally', () => {
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return true;
        });
        position = 'o12h';
        service.placeWord(position, word);
        const expectedAction = cold('a', {
            a: receivedMessage({ username: '', message: 'Erreur de syntaxe: le mot ne rentre pas dans plateau', messageType: 'Error' }),
        });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('placeWord should dispatch receivedMessage if word is not placable because it extends out of the board vertically', () => {
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return true;
        });
        position = 'l15v';
        service.placeWord(position, word);
        const expectedAction = cold('a', {
            a: receivedMessage({ username: '', message: 'Erreur de syntaxe: le mot ne rentre pas dans plateau', messageType: 'Error' }),
        });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('placeWord should not dispatch placeWordSuccess if letters are not in Easel', () => {
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return false;
        });
        const dispatchSpy = spyOn(service['boardStore'], 'dispatch');
        position = 'h7h';
        service.placeWord(position, word);
        const expectedWord = new Word('word', { x: 6, y: 7 } as Vec2, Direction.HORIZONTAL);
        expect(dispatchSpy).not.toHaveBeenCalledWith(placeWordSuccess({ word: expectedWord }));
    });

    it('exchangeLetters should call socketService send with namespace command if letters are in easel', () => {
        const letters = 'aerev';
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return true;
        });
        const sendSpy = spyOn(service['socketService'], 'send');
        service.exchangeLetters(letters);
        expect(sendSpy).toHaveBeenCalledOnceWith('command', 'échanger aerev');
    });

    it('exchangeLetters should not call socketService send if letters are not in easel', () => {
        const letters = 'aerev';
        spyOn(service, 'lettersInEasel').and.callFake(() => {
            return false;
        });
        const sendSpy = spyOn(service['socketService'], 'send');
        service.exchangeLetters(letters);
        expect(sendSpy).not.toHaveBeenCalled();
    });

    it('lettersInEasel should return true if all letters are in easel', () => {
        expect(service.lettersInEasel('abcG')).toBeTrue();
    });

    it('lettersInEasel should return false if a letter is not in the easel', () => {
        expect(service.lettersInEasel('abca')).toBeFalse();
    });

    it('checkNearSpaces should return true if the position is close to another letter', () => {
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        expect(service['checkNearSpaces'](CENTER_BOARD - 1, CENTER_BOARD, board)).toBeTrue();
    });

    it('checkNearSpaces should return true if the position in the center even if no letters are placed', () => {
        expect(service['checkNearSpaces'](CENTER_BOARD, CENTER_BOARD, board)).toBeTrue();
    });

    it('checkNearSpaces should return false if there is no letters placed and the position is not the center', () => {
        expect(service['checkNearSpaces'](0, 0, board)).toBeFalse();
    });

    it('checkNearSpaces should return false if there is no letters in the nearby spaces', () => {
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        expect(service['checkNearSpaces'](0, 0, board)).toBeFalse();
    });

    it('checkNearSpaces should return false if there is no letters in the nearby spaces', () => {
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        expect(service['checkNearSpaces'](2, 2, board)).toBeFalse();
    });

    it('checkNearSpaces should return false if there is no letters in the nearby spaces and not crash with min column and line attributes', () => {
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        expect(service['checkNearSpaces'](0, 0, board)).toBeFalse();
    });

    it('checkNearSpaces should return false if there is no letters in the nearby spaces and not crash with max column and line attributes', () => {
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        expect(service['checkNearSpaces'](BOARD_SIZE - 1, BOARD_SIZE - 1, board)).toBeFalse();
    });

    it('wordPlacementCorrect should return true if the word is placed correctly close to another letter', () => {
        spyOn(service as any, 'checkNearSpaces').and.callFake(() => {
            return true;
        });
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        position = 'h7';
        const direction = 'v';
        word = 'test';
        expect(service.wordPlacementCorrect(position, direction, word)).toBeTrue();
    });

    it('wordPlacementCorrect should return true if the word is placed on another letter corresponding to the word', () => {
        spyOn(service as any, 'checkNearSpaces').and.callFake(() => {
            return false;
        });
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        position = 'h8';
        const direction = 'v';
        word = 'ae';
        expect(service.wordPlacementCorrect(position, direction, word)).toBeTrue();
    });

    it('wordPlacementCorrect should return false if no letter are close or on the path vertically', () => {
        spyOn(service as any, 'checkNearSpaces').and.callFake(() => {
            return false;
        });
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        position = 'a1';
        const direction = 'v';
        word = 'ae';
        expect(service.wordPlacementCorrect(position, direction, word)).toBeFalse();
    });

    it('wordPlacementCorrect should return false if no letter are close or on the path horizontally', () => {
        spyOn(service as any, 'checkNearSpaces').and.callFake(() => {
            return false;
        });
        position = 'e6';
        const direction = 'h';
        word = 'ae';
        expect(service.wordPlacementCorrect(position, direction, word)).toBeFalse();
    });

    it('wordPlacementCorrect should return false a letter is on the space but is different from the one in the word', () => {
        spyOn(service as any, 'checkNearSpaces').and.callFake(() => {
            return false;
        });
        board[CENTER_BOARD][CENTER_BOARD] = 'A';
        position = 'h8';
        const direction = 'v';
        word = 'ze';
        expect(service.wordPlacementCorrect(position, direction, word)).toBeFalse();
    });

    it('letterOnBoard should return a string if a letter exists on the board at the given position', () => {
        const letterAPosition = 1;
        expect(service.letterOnBoard(letterAPosition, letterAPosition)).toEqual('a');
    });

    it('letterOnBoard should return a undefined if a letter does not exists on the board at the given position', () => {
        const noLetterPosition = 9;
        expect(service.letterOnBoard(noLetterPosition, noLetterPosition)).toBeUndefined();
    });
});
