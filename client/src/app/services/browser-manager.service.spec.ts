import { TestBed } from '@angular/core/testing';
import { restoreMessages } from '@app/actions/chat.actions';
import { refreshTimer } from '@app/actions/game-status.actions';
import { DEFAULT_TIMER } from '@app/components/multi-config-window/multi-config-window.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { BrowserManagerService } from './browser-manager.service';
import { SocketClientService } from './socket-client.service';

describe('BrowserManagerService', () => {
    let service: BrowserManagerService;
    let socketService: SocketClientService;
    let store: MockStore;
    const waitingTime = 250;

    beforeEach(async () => {
        socketService = new SocketClientService();
        await TestBed.configureTestingModule({
            providers: [provideMockStore({ selectors: [{ selector: 'chat', value: [{ username: 'Player', message: 'Message' }] }] })],
        }).compileComponents();
        service = TestBed.inject(BrowserManagerService);
        store = TestBed.inject(MockStore);
        service.socketService = socketService;
        socketService.connect();
    });
    afterEach(() => {
        document.cookie = 'socket= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'; // Permet de supprimer les cookies créée pour le test
        socketService.disconnect();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('beforeUnloadHandler should call socketService.send', () => {
        const socketSendSpy = spyOn(socketService, 'send').and.callThrough();
        service.onBrowserClosed();
        expect(socketSendSpy).toHaveBeenCalled();
    });

    it('beforeUnloadHandler should add a cookie', () => {
        const testSocketId = 'theSocketId';
        socketService.socket.id = testSocketId;
        const expectedCookie = 'socket=' + testSocketId;
        service.onBrowserClosed();
        expect(document.cookie.includes(expectedCookie)).toBeTrue();
    });

    it('onloadHandler should call socketService.isSocketAlive and not .connect if a socket is still alive', () => {
        const socketAliveSpy = spyOn(socketService, 'isSocketAlive').and.callFake(() => {
            return true;
        });
        const connectSpy = spyOn(socketService, 'connect').and.callThrough();
        service.onBrowserLoad();
        expect(socketAliveSpy).toHaveBeenCalled();
        expect(connectSpy).not.toHaveBeenCalled();
    });

    it("onloadHandler should call socketService.connect if a socket isn't connected", () => {
        const connectSpy = spyOn(socketService, 'connect').and.callThrough();
        socketService.disconnect();
        service.onBrowserLoad();
        expect(connectSpy).toHaveBeenCalled();
    });

    it('onloadHandler should send browser reconnection event when the socket cookie is not undefined', () => {
        localStorage.setItem('chatMessages', '[]');
        const fakeSend = () => {
            return;
        };
        const sendSpy = spyOn(socketService, 'send').and.callFake(fakeSend);
        socketService.disconnect();
        const expectedOldId = 'MyOldSocketId';
        document.cookie = 'socket=' + expectedOldId + '; path=/';
        service.onBrowserLoad();
        expect(sendSpy).toHaveBeenCalledOnceWith('browser reconnection', expectedOldId);
    });

    it('storeSelectors should store the data selector in localStorage', () => {
        const providedMessage = { username: 'Player', message: 'Message' };
        // eslint-disable-next-line dot-notation
        service['storeSelectors']();
        expect(localStorage.getItem('chatMessages')).toEqual(JSON.stringify([providedMessage]));
    });

    it('retrieveSelectors should get the local storage stored under the chatMessages key and dispatch restoreMessages', () => {
        const expectedMessage = JSON.stringify([{ username: 'Player1', message: 'HelloWorld' }]);
        localStorage.setItem('chatMessages', expectedMessage);
        // eslint-disable-next-line dot-notation
        service['retrieveSelectors']();
        const expectedAction = cold('a', { a: restoreMessages({ oldMessages: JSON.parse(expectedMessage) }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('retrieveSelectors should not dispatch restoreMessages if no chatMessages key exist in LocalStorage', () => {
        localStorage.removeItem('chatMessages');
        // eslint-disable-next-line dot-notation
        service['retrieveSelectors']();
        const dispatchSpy = spyOn(store, 'dispatch').and.callFake(() => {
            return;
        });
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('readCookieSocket should return the value of cookie stored with the key socket', () => {
        const expectedResult = 'ABC__4586fnpelocq';
        document.cookie = 'socket=' + expectedResult + '; path=/';
        expect(service.readCookieSocket).toEqual(expectedResult);
    });

    it('readCookieSocket should return undefined if no cookie with the key socket exist', () => {
        expect(service.readCookieSocket).toEqual(undefined);
    });

    // it('onBrowserLoad should not dispatch refreshTimer if no currentTimer key exist in LocalStorage', () => {
    //     localStorage.removeItem('currentTimer');
    //     service.onBrowserLoad();
    //     const dispatchSpy = spyOn(store, 'dispatch').and.callFake(() => {
    //         return;
    //     });
    //     expect(dispatchSpy).not.toHaveBeenCalled();
    // });

    it('should should not dispatch refreshTimer if no currentTimer key exist in LocalStorage', (done) => {
        localStorage.removeItem('currentTimer');
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['store'], 'dispatch');
        const fakeSend = () => {
            return ' ';
        };
        spyOnProperty(service, 'readCookieSocket', 'get').and.callFake(fakeSend);
        service.onBrowserLoad();
        setTimeout(() => {
            expect(spy).not.toHaveBeenCalledWith(refreshTimer({ timer: DEFAULT_TIMER }));
            localStorage.clear();
            done();
        }, waitingTime);
    });

    it('should dispatch refreshTimer if there is the currentTimer key in LocalStorage', (done) => {
        const date = new Date();
        localStorage.setItem('currentTimer', JSON.stringify({ countdown: DEFAULT_TIMER, date: date.getTime() }));
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['store'], 'dispatch');
        const fakeSend = () => {
            return ' ';
        };
        spyOnProperty(service, 'readCookieSocket', 'get').and.callFake(fakeSend);
        service.onBrowserLoad();
        setTimeout(() => {
            expect(spy).toHaveBeenCalledWith(refreshTimer({ timer: DEFAULT_TIMER }));
            localStorage.clear();
            done();
        }, waitingTime);
    });
});
