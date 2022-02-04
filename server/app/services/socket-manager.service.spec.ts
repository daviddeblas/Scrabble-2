/* eslint-disable dot-notation */
import { GameOptions } from '@app/classes/game-options';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import io from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketService } from './socket-manager.service';

// eslint-disable dot-notation

const RESPONSE_DELAY = 200;
describe('SocketManager service tests', () => {
    let service: SocketService;
    let server: Server;
    let clientSocket: Socket;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        // eslint-disable-next-line dot-notation
        service = server['socketService'];
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        // eslint-disable-next-line dot-notation
        service['sio'].close();
        sinon.restore();
    });

    it('should handle create room event and create a new Room', (done) => {
        const roomManagerSpy = sinon.spy(service.rooms, 'createRoom');
        const defaultOptions: GameOptions = { hostname: 'My Name', dictionaryType: 'My Dictionary', timePerRound: 60 };
        clientSocket.emit('create room', defaultOptions);
        setTimeout(() => {
            assert(roomManagerSpy.calledOnce);
            assert(service.rooms.rooms.length === 1); // Une salle a bien été ajouté
            done();
        }, RESPONSE_DELAY);
    });
    it('should handle create room event and emit game settings event', (done) => {
        const defaultOptions: GameOptions = { hostname: 'My Name', dictionaryType: 'My Dictionary', timePerRound: 60 };
        clientSocket.emit('create room', defaultOptions);
        clientSocket.on('game settings', (returnedOptions: GameOptions) => {
            expect(defaultOptions).to.deep.equal(returnedOptions);
            done();
        });
    });

    it('should handle request list event and emit get list event with empty list when no rooms are available', (done) => {
        clientSocket.emit('request list');
        clientSocket.on('get list', (listOfRooms) => {
            expect(listOfRooms).to.deep.equal([]);
            expect(listOfRooms).to.be.length(0);
            done();
        });
    });

    it('should handle request list event and call getRooms', (done) => {
        const roomManagerSpy = sinon.spy(service.rooms, 'getRooms');
        clientSocket.emit('request list');
        clientSocket.on('get list', (listOfRooms) => {
            expect(listOfRooms).to.deep.equal([]);
            setTimeout(() => {
                assert(roomManagerSpy.calledOnce);
                done();
            }, RESPONSE_DELAY);
        });
    });

    it('should handle request list event and emit get list event with the hostnames of the accessible rooms', (done) => {
        const defaultOptions: GameOptions = { hostname: 'My Name', dictionaryType: 'My Dictionary', timePerRound: 60 };
        clientSocket.emit('create room', defaultOptions);
        clientSocket.emit('request list');
        clientSocket.on('get list', (listOfRooms) => {
            expect(listOfRooms).to.deep.contain(defaultOptions.hostname);
            expect(listOfRooms).to.be.length(1);
            done();
        });
    });

    it('should handle get dictionaries event and emit receive dictionaries event with the dictionaries names', (done) => {
        const expectedList = ['Mon dictionnaire'];
        clientSocket.emit('get dictionaries');
        clientSocket.on('receive dictionaries', (listOfDictionary) => {
            expect(listOfDictionary).to.deep.equal(expectedList);
            expect(listOfDictionary).to.be.length(1);
            done();
        });
    });

    it('should handle join room event and call joinRoom', (done) => {
        const roomsManagerStub = sinon.stub(service.rooms);
        const data = { roomId: 0, playerName: 'Second Player' };
        clientSocket.emit('join room', data);
        setTimeout(() => {
            assert(roomsManagerStub.joinRoom.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });

    it("should handle join room event and emit player arrival event with the new player's name", (done) => {
        const roomsManagerMock = sinon.mock(service.rooms);
        roomsManagerMock.expects('joinRoom');
        const data = { roomId: 0, playerName: 'Second Player' };
        clientSocket.emit('join room', data);
        clientSocket.on('player arrival', (playerName: string) => {
            expect(playerName).to.deep.equal(data.playerName);
            roomsManagerMock.verify();
            done();
        });
    });

    it('isOpen should return true when set to default value', (done) => {
        const isOpen: boolean = service.isOpen();
        assert(isOpen === true);
        done();
    });

    it('isOpen should return false when max listener count is 0', (done) => {
        // eslint-disable-next-line dot-notation
        service['sio'].setMaxListeners(0);
        const isOpen: boolean = service.isOpen();
        assert(isOpen === false);
        done();
    });

    it('browser reconnection should call clear timeout if the old sockets are equal', (done) => {
        const oldClientId = '123';
        const timeoutSpy = sinon.spy(global, 'clearTimeout');

        service['tempClientSocketId'] = oldClientId;
        const testTimeoutId = setTimeout(() => {
            assert(false);
        }, RESPONSE_DELAY);
        service['timeoutId'] = testTimeoutId;
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
        service['timeoutId'] = testTimeoutId;
        service['tempClientSocketId'] = '100';
        clientSocket.emit('browser reconnection', oldClientId);
    });

    it('closed browser should assign a new tempClientSocketId and tempServerSocket', (done) => {
        const userId = '123';
        clientSocket.emit('closed browser', userId);
        setTimeout(() => {
            expect(service['tempClientSocketId']).to.deep.equal(userId);
            expect(service['tempServerSocket'].id).to.deep.equal(clientSocket.id);
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
