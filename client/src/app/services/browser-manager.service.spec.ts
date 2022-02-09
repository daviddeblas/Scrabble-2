import { TestBed } from '@angular/core/testing';
import { BrowserManagerService } from './browser-manager.service';
import { SocketClientService } from './socket-client.service';

describe('BrowserManagerService', () => {
    let service: BrowserManagerService;
    let socketService: SocketClientService;
    beforeEach(async () => {
        socketService = new SocketClientService();
        service = TestBed.inject(BrowserManagerService);
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

    it('readCookieSocket should return the value of cookie stored with the key socket', () => {
        const expectedResult = 'ABC__4586fnpelocq';
        document.cookie = 'socket=' + expectedResult + '; path=/';
        expect(service.readCookieSocket).toEqual(expectedResult);
    });

    it('readCookieSocket should return undefined if no cookie with the key socket exist', () => {
        expect(service.readCookieSocket).toEqual(undefined);
    });
});
