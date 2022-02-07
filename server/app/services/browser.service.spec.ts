import { PORT, RESPONSE_DELAY } from '@app/environnement.json';
import { assert, expect } from 'chai';
import { createServer, Server } from 'http';
import * as sinon from 'sinon';
import io from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { BrowserService } from './browser.service';
import { RoomsManager } from './rooms-manager.service';

describe('Browser service tests', () => {
    let service: BrowserService;
    let clientSocket: Socket;
    let server: io.Server;
    let httpServer: Server;
    const urlString = 'http://localhost:3000';
    // let serverSocket: io.Socket;

    before((done) => {
        httpServer = createServer();
        httpServer.listen(PORT);
        server = new io.Server(httpServer);
        httpServer.on('listening', () => done());
    });

    beforeEach(async () => {
        server.on('connection', (socket) => {
            service.setupSocketConnection(socket);
        });
        const roomsManager = new RoomsManager();
        service = new BrowserService(roomsManager);
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        sinon.restore();
        server.removeAllListeners();
    });

    after(() => {
        server.close();
        httpServer.close();
    });

    it('browser reconnection should call clear timeout if the old sockets are equal', (done) => {
        const oldClientId = '123';
        const timeoutSpy = sinon.spy(global, 'clearTimeout');

        service.tempClientSocketId = oldClientId;
        const testTimeoutId = setTimeout(() => {
            assert(false);
        }, RESPONSE_DELAY);
        service.timeoutId = testTimeoutId;
        clientSocket.emit('browser reconnection', oldClientId);
        setTimeout(() => {
            assert(timeoutSpy.calledWith(testTimeoutId) === true);
            done();
        }, RESPONSE_DELAY);
    });

    it('browser reconnection should not call clear timeout if the old sockets are different', (done) => {
        const oldClientId = '123';
        const timeoutSpy = sinon.spy(global, 'clearTimeout');
        const testTimeoutId = setTimeout(() => {
            assert(timeoutSpy.calledWith(testTimeoutId) === false);
            done();
        }, RESPONSE_DELAY);
        service.timeoutId = testTimeoutId;
        service.tempClientSocketId = '100';
        clientSocket.emit('browser reconnection', oldClientId);
    });

    it('closed browser should assign a new tempClientSocketId and tempServerSocket', (done) => {
        const userId = '123';
        clientSocket.emit('closed browser', userId);
        setTimeout(() => {
            expect(service.tempClientSocketId).to.deep.equal(userId);
            expect(service.tempServerSocket.id).to.deep.equal(clientSocket.id);
            done();
        }, RESPONSE_DELAY);
    });

    it('closed browser should set a 5 second timeout and call getOpponentSocket ', (done) => {
        const testUserId = '123';
        const roomsManagerMock = sinon.mock(service.rooms);
        roomsManagerMock.expects('getOpponentSocket').once();
        clientSocket.emit('closed browser', testUserId);
        const timeoutSixSec = 6000;
        setTimeout(() => {
            roomsManagerMock.verify();
            done();
        }, timeoutSixSec);
    });

    it('closed browser should set a 5 second timeout and emit victory to the opponent ', (done) => {
        const opponentSocketStub = {
            emit: (emitType: string) => {
                if (emitType === 'victory') {
                    expect(roomsManagerStub.calledOnce).to.equal(true);
                    done();
                }
            },
        } as unknown as io.Socket;
        const testUserId = '123';
        const roomsManagerStub = sinon.stub(service.rooms, 'getOpponentSocket').callsFake(() => {
            return opponentSocketStub;
        });
        clientSocket.emit('closed browser', testUserId);
    });
});
