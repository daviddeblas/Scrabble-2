import { GameOptions } from '@app/classes/game-options';
import { RoomInfo } from '@app/classes/room-info';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketService } from './socket-manager.service';

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
        const roomManagerSpy = sinon.spy(service.roomManager, 'createRoom');
        const defaultOptions: GameOptions = { hostname: 'My Name', dictionaryType: 'My Dictionary', timePerRound: 60 };
        clientSocket.emit('create room', defaultOptions);
        setTimeout(() => {
            assert(roomManagerSpy.calledOnce);
            assert(service.roomManager.rooms.length === 1); // Une salle a bien été ajouté
            done();
        }, RESPONSE_DELAY);
    });
    it('should handle create room event and emit game settings event', (done) => {
        const defaultOptions: GameOptions = { hostname: 'My Name', dictionaryType: 'My Dictionary', timePerRound: 60 };
        clientSocket.emit('create room', defaultOptions);
        clientSocket.on('create room success', (info: RoomInfo) => {
            expect(defaultOptions).to.deep.equal(info.gameOptions);
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
        const roomManagerSpy = sinon.spy(service.roomManager, 'getRooms');
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
        clientSocket.on('get list', (listOfRooms: RoomInfo[]) => {
            expect(listOfRooms.filter((room) => room.gameOptions.hostname === defaultOptions.hostname).length).to.eq(1);
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
        const roomsManagerStub = sinon.stub(service.roomManager);
        const data = { roomId: 0, playerName: 'Second Player' };
        clientSocket.emit('join room', data);
        setTimeout(() => {
            assert(roomsManagerStub.joinRoom.calledOnce);
            done();
        }, RESPONSE_DELAY);
        done();
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
});
