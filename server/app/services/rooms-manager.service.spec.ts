/* eslint-disable import/no-deprecated */
import { GameConfig } from '@app/classes/game-config';
import { GameOptions } from '@app/classes/game-options';
import { Game } from '@app/classes/game/game';
import { Room } from '@app/classes/room';
import { RoomInfo } from '@app/classes/room-info';
import { PORT } from '@app/environnement.json';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { restore, stub } from 'sinon';
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

    it('getRooms should return empty list if no rooms are created', () => {
        const expectedResult: Room[] = [];
        expect(roomsManager.getRooms()).to.deep.equal(expectedResult);
    });

    it('getAvailableRooms should return only not started games', () => {
        roomsManager.createRoom(socket, options);
        const expectedResult = [new RoomInfo(socket.id, options)];
        expect(roomsManager.getAvailableRooms()).to.deep.equal(expectedResult);

        const otherOption = { hostname: 'Second Name', dictionaryType: 'Dictionary', timePerRound: 90 };
        roomsManager.createRoom(socket, otherOption);
        // eslint-disable-next-line dot-notation
        roomsManager.rooms[1].game = new Game(new GameConfig(), ['']);
        expect(roomsManager.getAvailableRooms()).to.deep.equal(expectedResult);
    });

    describe('switchPlayerSocket', () => {
        let oldPlayerSocket: Socket;
        let newPlayerSocket: Socket;
        beforeEach(() => {
            oldPlayerSocket = {
                id: 'Old Player',
                once: () => {
                    return;
                },
                removeAllListeners: () => {
                    return oldPlayerSocket;
                },
            } as unknown as Socket;
            newPlayerSocket = { id: 'New Player' } as unknown as Socket;
        });

        afterEach(() => {
            restore();
        });

        it('switchPlayerSocket should not call initiateRoomEvents if the room is undefined', () => {
            const getRoomStub = stub(roomsManager, 'getRoom').callsFake(() => {
                return undefined;
            });
            roomsManager.switchPlayerSocket(oldPlayerSocket, newPlayerSocket);
            expect(getRoomStub.calledOnceWith(oldPlayerSocket.id)).to.deep.equal(true);
            getRoomStub.restore();
        });

        it('switchPlayerSocket should switch the host if the ids match and call initiateRoomEvents', () => {
            const testRoom = new Room(oldPlayerSocket, roomsManager, {} as GameOptions);
            const initiateRoomStub = stub(testRoom, 'initiateRoomEvents').callsFake(() => {
                return;
            });
            const getRoomStub = stub(roomsManager, 'getRoom').callsFake(() => {
                return testRoom;
            });
            roomsManager.switchPlayerSocket(oldPlayerSocket, newPlayerSocket);
            expect(getRoomStub.calledOnceWith(oldPlayerSocket.id)).to.deep.equal(true);
            expect(testRoom.host).to.deep.equal(newPlayerSocket);
            expect(initiateRoomStub.calledOnce).to.deep.equal(true);
            getRoomStub.restore();
        });

        it('switchPlayerSocket should switch the client if the ids match and call initiateRoomEvents', () => {
            const testRoom = new Room(oldPlayerSocket, roomsManager, {} as GameOptions);
            testRoom.clients[0] = socket;
            const initiateRoomEventsStub = stub(testRoom, 'initiateRoomEvents').callsFake(() => {
                return;
            });
            const getRoomStub = stub(roomsManager, 'getRoom').callsFake(() => {
                return testRoom;
            });
            roomsManager.switchPlayerSocket(socket, newPlayerSocket);
            expect(getRoomStub.calledOnceWith(socket.id)).to.deep.equal(true);
            expect(testRoom.clients[0]).to.deep.equal(newPlayerSocket);
            expect(initiateRoomEventsStub.calledOnce).to.equal(true);
            initiateRoomEventsStub.restore();
            getRoomStub.restore();
        });

        it('switchPlayerSocket should switch the host if the ids match and call removeUnneededListeners if client exist', () => {
            const testRoom = new Room(oldPlayerSocket, roomsManager, {} as GameOptions);
            testRoom.clients[0] = socket;
            const initiateRoomEventsStub = stub(testRoom, 'initiateRoomEvents').callsFake(() => {
                return;
            });
            const getRoomStub = stub(roomsManager, 'getRoom').callsFake(() => {
                return testRoom;
            });
            const removeListenersStub = stub(testRoom, 'removeUnneededListeners').callsFake(() => {
                return;
            });
            roomsManager.switchPlayerSocket(oldPlayerSocket, newPlayerSocket);
            expect(getRoomStub.calledOnceWith(oldPlayerSocket.id)).to.deep.equal(true);
            expect(initiateRoomEventsStub.calledOnce).to.equal(true);
            expect(removeListenersStub.calledOnce).to.equal(true);
            initiateRoomEventsStub.restore();
            getRoomStub.restore();
        });
    });

    it('getRoom should return undefined if there is no socket Id corresponding to the playerId passed as a parameter', () => {
        const otherOption = { hostname: 'Second Name', dictionaryType: 'Dictionary', timePerRound: 90 };
        roomsManager.rooms.push(new Room(socket, roomsManager, otherOption));
        const undefinedID = '3';
        expect(roomsManager.getRoom(undefinedID)).to.deep.equal(undefined);
    });

    it('getRoom should return the room if the host socket Id is passed as a parameter', () => {
        const otherOption = { hostname: 'Second Name', dictionaryType: 'Dictionary', timePerRound: 90 };
        const expectedRoom = new Room(socket, roomsManager, otherOption);
        roomsManager.rooms.push(expectedRoom);
        expect(roomsManager.getRoom(socket.id)).to.equal(expectedRoom);
    });

    it('getRoom should return the room if the opponent socket Id is passed as a parameter', () => {
        const opponentSocket = { id: 'Opponent' } as unknown as Socket;
        const otherOption = { hostname: 'Second Name', dictionaryType: 'Dictionary', timePerRound: 90 };
        const expectedRoom = new Room(socket, roomsManager, otherOption);
        expectedRoom.clients[0] = opponentSocket;
        roomsManager.rooms.push(expectedRoom);
        expect(roomsManager.getRoom(opponentSocket.id)).to.equal(expectedRoom);
    });
    describe('Setup connection events', () => {
        let server: MainServer;
        let httpServer: Server;
        let clientSocket: ClientSocket;
        const RESPONSE_DELAY = 200;
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
            clientSocket.removeAllListeners();
            server.removeAllListeners();
            restore();
        });

        after(() => {
            server.close();
            httpServer.close();
        });

        it('emitting create room should call the createRoom function', (done) => {
            const room: RoomInfo = new RoomInfo('RoomID', {} as GameOptions);
            stub(roomsManager, 'createRoom').callsFake(() => {
                done();
                return room;
            });
            server.on('connection', (serverSocket) => {
                roomsManager.setupSocketConnection(serverSocket);
            });
            clientSocket.emit('create room');
        });

        it('emitting request list should call the getRooms function', (done) => {
            const rooms: RoomInfo[] = [new RoomInfo('RoomID', {} as GameOptions)];
            const getRoomsStub = stub(roomsManager, 'getAvailableRooms').callsFake(() => {
                return rooms;
            });
            server.on('connection', (serverSocket) => {
                roomsManager.setupSocketConnection(serverSocket);
            });

            clientSocket.emit('request list');

            setTimeout(() => {
                expect(getRoomsStub.calledOnce).to.equal(true);
                done();
            }, RESPONSE_DELAY);
        });

        it('emitting join room should call the joinRoom function', (done) => {
            const joinRoomStub = stub(roomsManager, 'joinRoom').callsFake(() => {
                return;
            });
            server.on('connection', (serverSocket) => {
                roomsManager.setupSocketConnection(serverSocket);
            });
            clientSocket.emit('join room', { roomId: '1', playerName: 'player 2' });
            setTimeout(() => {
                expect(joinRoomStub.calledOnce).to.equal(true);
                done();
            }, RESPONSE_DELAY);
        });
    });
});
