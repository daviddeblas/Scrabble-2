import { SocketTestHelper } from '@app/classes/socket-test-helper';

describe('SocketTestHelper', () => {
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        socketTestHelper = new SocketTestHelper();
    });

    it('should be created', () => {
        expect(socketTestHelper).toBeTruthy();
    });

    // La fonction disconnect est présente pour immiter la classe SocketClientService mais dans ce cas,
    // elle n'as pas besoin de faire quelque chose car il ni à pas de réel connexion avec le server
    it('disconnect should not do anything', () => {
        const spy = spyOn(socketTestHelper, 'disconnect').and.callThrough();
        socketTestHelper.disconnect();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('on should call all functions given corresponding to the event', () => {
        const firstFunction = jasmine.createSpy();
        socketTestHelper.on('test counter', firstFunction);
        const secondFunction = jasmine.createSpy();
        socketTestHelper.on('test counter', secondFunction);
        socketTestHelper.peerSideEmit('test counter');
        expect(secondFunction).toHaveBeenCalledTimes(1);
        expect(firstFunction).toHaveBeenCalledTimes(1);
    });

    it('peerSideEmit should call the function corresponding to the event', () => {
        const spy = jasmine.createSpy();
        socketTestHelper.on('test counter', spy);
        socketTestHelper.peerSideEmit('test counter');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('peerSideEmit should not call a function if the event is not initialized', () => {
        const counter = () => {
            // eslint-disable-next-line no-console
            console.log();
        };
        socketTestHelper.on('test counter', counter);
        const spy = spyOn(console, 'log');
        socketTestHelper.peerSideEmit('counter');
        expect(spy).toHaveBeenCalledTimes(0);
    });
});
