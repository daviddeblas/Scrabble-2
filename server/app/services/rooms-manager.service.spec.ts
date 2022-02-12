import { GameOptions } from '@app/classes/game-options';
import { Room } from '@app/classes/room';
import { RoomInfo } from '@app/classes/room-info';
import { PORT } from '@app/environnement.json';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { stub } from 'sinon';
import { Server as MainServer, Socket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { Container } from 'typedi';
import { RoomsManager } from './rooms-manager.service';

describe('Rooms Manager Service', () => {
    let roomsManager: RoomsManager;
    let options: GameOptions;
    let socket: Socket;

    beforeEach(async () => {
        roomsManager = Container.get(RoomsManager);
        options = { hostname: 'My Name', dictionaryType: 'My Dictionary', timePerRound: 60 };
        socket = {
            once: () => {
                return;
            },
            id: '1',
            emit: () => {
                return;
            },
        } as unknown as Socket;
    });

    afterEach(() => {
        roomsManager.rooms = []; // Reinitialisation de la liste de salle
    });

    it('createRoom should add a new room to the list', () => {
        roomsManager.createRoom(socket, options);
        expect(roomsManager.rooms).to.be.length(1);
    });

    it('removeRoom should remove the created room from the list', () => {
        roomsManager.createRoom(socket, options);
        expect(roomsManager.rooms).to.be.length(1);
        roomsManager.removeRoom(roomsManager.rooms[0]);
        expect(roomsManager.rooms).to.deep.equal([]);
    });

    it('joinRoom should call join if the room exists', () => {
        roomsManager.createRoom(socket, options);
        expect(roomsManager.rooms).to.be.length(1);
        const playerName = 'Second player';
        expect(roomsManager.rooms[0].clients[0]).to.be.equal(undefined);
        roomsManager.joinRoom('1', socket, playerName);
        expect(roomsManager.rooms[0].clients[0]).to.deep.equal(socket);
    });

    it('joinRoom should throw Game not found error if the Room does not exist', () => {
        // const joinRoomSpy = sinon.spy(roomsManager.joinRoom);
        let errorMessage = 'Not the right message';
        const expectedMessage = 'Game not found';
        try {
            const playerName = 'Second player';
            roomsManager.joinRoom('1', socket, playerName);
        } catch (error) {
            errorMessage = error.message;
        }
        expect(errorMessage).to.be.equal(expectedMessage);
    });

    it('getRooms should return the hostname of all rooms', () => {
        roomsManager.createRoom(socket, options);
        const expectedResult = [new RoomInfo(socket.id, options)];
        expect(roomsManager.getRooms()).to.deep.equal(expectedResult);
        const otherOption = { hostname: 'Second Name', dictionaryType: 'Dictionary', timePerRound: 90 };
        roomsManager.createRoom(socket, otherOption);
        expectedResult.push(new RoomInfo(socket.id, otherOption));
        expect(roomsManager.getRooms()).to.deep.equal(expectedResult);
    });

    it('getRooms should return empty list if no rooms ar created', () => {
        const expectedResult: Room[] = [];
        expect(roomsManager.getRooms()).to.deep.equal(expectedResult);
    });
    describe('Setup connection events', () => {
        let server: MainServer;
        let httpServer: Server;
        let clientSocket: ClientSocket;
        before((done) => {
            httpServer = createServer();
            httpServer.listen(PORT);
            server = new MainServer(httpServer);
            httpServer.on('listening', () => done());
        });
        beforeEach(() => {
            clientSocket = Client('http://localhost:3000');
        });
        afterEach(() => {
            server.removeAllListeners();
        });

        after(() => {
            server.close();
            httpServer.close();
        });

        it('emitting create room should call the createRoom function', (done) => {
            const room: RoomInfo = new RoomInfo('RoomID', {} as GameOptions);
            const createRoomStub = stub(roomsManager, 'createRoom').callsFake(() => {
                return room;
            });
            server.on('connection', (serverSocket) => {
                roomsManager.setupSocketConnection(serverSocket);
                clientSocket.on('create room success', () => {
                    expect(createRoomStub.calledOnce).to.equal(true);
                    done();
                });
            });
            clientSocket.emit('create room');
        });

        it('emitting request list should call the getRooms function', (done) => {
            const rooms: RoomInfo[] = [new RoomInfo('RoomID', {} as GameOptions)];
            const getRoomsStub = stub(roomsManager, 'getRooms').callsFake(() => {
                return rooms;
            });
            server.on('connection', (serverSocket) => {
                roomsManager.setupSocketConnection(serverSocket);
                clientSocket.on('get list', () => {
                    expect(getRoomsStub.calledOnce).to.equal(true);
                    done();
                });
            });
            clientSocket.emit('request list');
        });

        it('emitting join room should call the joinRoom function', (done) => {
            const joinStub = stub(roomsManager, 'joinRoom').callsFake(() => {
                return;
            });
            server.on('connection', (serverSocket) => {
                roomsManager.setupSocketConnection(serverSocket);
                clientSocket.on('player joining', () => {
                    expect(joinStub.calledOnce).to.equal(true);
                    done();
                });
            });
            clientSocket.emit('join room', { roomId: '1', playerName: 'player 2' });
        });
    });
});
