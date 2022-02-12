/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { receivedMessage } from '@app/actions/chat.actions';
import { exchangeLetters, placeWord, skipTurn } from '@app/actions/player.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { stringToLetters } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Direction, Word } from '@app/classes/word';
import { SocketTestHelper } from '@app/helper/socket-test-helper';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { Socket } from 'socket.io-client';
import { ChatService } from './chat.service';

describe('ChatService', () => {
    let service: ChatService;
    let store: MockStore;
    let username: string;
    let socketHelper: SocketTestHelper;
    const RESPONSE_TIME = 200;
    const ASCII_ALPHABET_POSITION = 97;
    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        await TestBed.configureTestingModule({ providers: [provideMockStore()] }).compileComponents();
        service = TestBed.inject(ChatService);
        store = TestBed.inject(MockStore);
        service['socketService'].socket = socketHelper as unknown as Socket;
        username = 'My name';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('broadcastMsg should emit send message with the username and message', (done) => {
        const sendSpy = spyOn(service['socketService'], 'send');
        const expectedMessage = { username: 'My Name', message: 'Coucou' };
        service.broadcastMsg(expectedMessage.username, expectedMessage.message);
        setTimeout(() => {
            expect(sendSpy).toHaveBeenCalledOnceWith('send message', expectedMessage);
            done();
        }, RESPONSE_TIME);
    });

    it('acceptNewMessages should be able to receive message and dispatch "[Chat] Received message"', (done) => {
        const expectedMessage: ChatMessage = { username: 'My Name', message: 'Coucou' };
        service.acceptNewMessages();
        socketHelper.peerSideEmit('receive message', expectedMessage);
        setTimeout(() => {
            const expectedAction = cold('a', { a: receivedMessage(expectedMessage) });
            expect(store.scannedActions$).toBeObservable(expectedAction);
            done();
        }, RESPONSE_TIME);
    });

    it('should dispatch "[Chat] Received message" with the username and message when the message does not start by !', () => {
        const exampleMessage = 'Bonjour';
        service.messageWritten(username, exampleMessage);
        const expectedAction = cold('a', { a: receivedMessage({ username, message: exampleMessage }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should dispatch "[Chat] Received message" with an Error if the command does not exist', () => {
        const exampleMessage = '!Bonjour';
        service.messageWritten(username, exampleMessage);
        const expectedAction = cold('a', { a: receivedMessage({ username: 'Error', message: 'Commande impossible à réalisée' }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should dispatch "[Chat] Received message" with a syntax Error if the command passer is not valid', () => {
        const exampleMessage = '!passer ,z4,e';
        service.messageWritten(username, exampleMessage);
        const expectedAction = cold('a', { a: receivedMessage({ username: 'Error', message: 'Erreur de syntaxe' }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should dispatch "[Chat] Received message" with a syntax Error if the command placer is not valid', () => {
        const exampleMessage = '!placer nfpe ,z4,e';
        service.messageWritten(username, exampleMessage);
        const expectedAction = cold('a', { a: receivedMessage({ username: 'Error', message: 'Erreur de syntaxe' }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should dispatch "[Chat] Received message" with a syntax Error if the command échanger is not valid', () => {
        const exampleMessage = '!échanger n_fpe38';
        service.messageWritten(username, exampleMessage);
        const expectedAction = cold('a', { a: receivedMessage({ username: 'Error', message: 'Erreur de syntaxe' }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should call handlePlaceCommand when typing a valid place command', () => {
        const dispatchSpy = spyOn(service['store'], 'dispatch');
        const exampleMessage = '!placer a11h abcpzoe';
        const position: Vec2 = { x: 'a'.charCodeAt(0) - ASCII_ALPHABET_POSITION, y: 10 };
        const expectedWord: Word = new Word(stringToLetters('abcpzoe'), position, Direction.HORIZONTAL);
        service.messageWritten(username, exampleMessage);
        expect(dispatchSpy).toHaveBeenCalledWith(placeWord({ word: expectedWord }));
    });

    it('should dispatch "[Players] Place Word" with a h direction when the place command is valid and has a h direction', () => {
        const dispatchSpy = spyOn(service['store'], 'dispatch');
        const exampleCommand = ['!placer', 'a11h', 'abcpzoe'];
        const position: Vec2 = { x: 'a'.charCodeAt(0) - ASCII_ALPHABET_POSITION, y: 10 };
        const expectedWord: Word = new Word(stringToLetters('abcpzoe'), position, Direction.HORIZONTAL);
        service['handlePlaceCommand'](exampleCommand);
        expect(dispatchSpy).toHaveBeenCalledWith(placeWord({ word: expectedWord }));
    });

    it('should dispatch "[Players] Place Word" with a v direction when the place command is valid and has a v direction', () => {
        const dispatchSpy = spyOn(service['store'], 'dispatch');
        const exampleCommand = ['!placer', 'a11v', 'abcpzoe'];
        const position: Vec2 = { x: 'a'.charCodeAt(0) - ASCII_ALPHABET_POSITION, y: 10 };
        const expectedWord: Word = new Word(stringToLetters('abcpzoe'), position, Direction.VERTICAL);
        service['handlePlaceCommand'](exampleCommand);
        expect(dispatchSpy).toHaveBeenCalledWith(placeWord({ word: expectedWord }));
    });

    it('should dispatch "[Players] Place Word" without a direction when the command is valid and no direction is given', () => {
        const dispatchSpy = spyOn(service['store'], 'dispatch');
        const exampleCommand = ['!placer', 'a11', 's'];
        const position: Vec2 = { x: 'a'.charCodeAt(0) - ASCII_ALPHABET_POSITION, y: 10 };
        const expectedWord: Word = new Word(stringToLetters('s'), position);
        service['handlePlaceCommand'](exampleCommand);
        expect(dispatchSpy).toHaveBeenCalledWith(placeWord({ word: expectedWord }));
    });

    it('should dispatch "[Players] Skip Turn" if a valid !passer command is given', () => {
        const dispatchSpy = spyOn(service['store'], 'dispatch');
        const exampleMessage = '!passer';
        service.messageWritten(username, exampleMessage);
        expect(dispatchSpy).toHaveBeenCalledWith(skipTurn());
    });
    it('should dispatch "[Players] Exchange Letters" with the letters to exchange if the command is valid', () => {
        const dispatchSpy = spyOn(service['store'], 'dispatch');
        const exampleMessage = '!échanger aerev';
        service.messageWritten(username, exampleMessage);
        expect(dispatchSpy).toHaveBeenCalledWith(exchangeLetters({ letters: stringToLetters('aerev') }));
    });

    it('validatePlaceCommand should return true when the command is properly called', () => {
        const exampleCommand = ['!placer', 'a11h', 'abcpzoNe'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeTrue();
    });

    it('validateExchangeCommand should return false when there are more than 3 parts to the command', () => {
        const exampleCommand = ['!placer', 'a11h', 'abcpzoe', 'last part'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false when the line letter is not from a to o', () => {
        const exampleCommand = ['!placer', 'v11h', 'abcpzoe'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false when the direction char is not h or v', () => {
        const exampleCommand = ['!placer', 'a11i', 'abcpzoe'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false when the last part is not only letters', () => {
        const exampleCommand = ['!placer', 'a11h', 'a_cp8oe'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return true if there is no direction letter but only 1 letter is placed', () => {
        const exampleCommand = ['!placer', 'a11', 'a'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeTrue();
    });

    it('validateExchangeCommand should return false if the number is greater than 15', () => {
        const exampleCommand = ['!placer', 'a16v', 'abcpzoe'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false if there is not only letters and numbers in the second part', () => {
        const exampleCommand = ['!placer', 'a1.6v_', 'abcpzoe'];
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return true if only letters are in the second part', () => {
        const exampleCommand = ['!échanger', 'abcpzoe'];
        expect(service['validateExchangeCommand'](exampleCommand)).toBeTrue();
    });

    it('validateExchangeCommand should return false if the second part contains anything else than letters', () => {
        const exampleCommand = ['!échanger', 'ab1pz.e'];
        expect(service['validateExchangeCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false if there is more than two parts to the command', () => {
        const exampleCommand = ['!échanger', 'abcpzoe', 'last part'];
        expect(service['validateExchangeCommand'](exampleCommand)).toBeFalse();
    });
});
