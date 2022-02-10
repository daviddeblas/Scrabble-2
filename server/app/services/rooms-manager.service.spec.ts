/* eslint-disable import/no-deprecated */
import { GameOptions } from '@app/classes/game-options';
import { Room } from '@app/classes/room';
import { RoomInfo } from '@app/classes/room-info';
import { expect } from 'chai';
import { stub } from 'sinon';
import { Socket } from 'socket.io';
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

    describe('switchPlayerSocket', () => {
        let oldPlayerSocket: Socket;
        let newPlayerSocket: Socket;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            oldPlayerSocket = { id: 'Old Player', once: () => {} } as unknown as Socket;
            newPlayerSocket = { id: 'New Player' } as unknown as Socket;
        });

        it('switchPlayerSocket should not call initiateRoomEvents if the room is undefined', () => {
            const getRoomStub = stub(roomsManager, 'getRoom').callsFake(() => {
                return undefined;
            });
            roomsManager.switchPlayerSocket(oldPlayerSocket, newPlayerSocket);
            expect(getRoomStub.calledOnceWith(oldPlayerSocket.id)).to.deep.equal(true);
            getRoomStub.restore();
        });

        it('switchPlayerSocket should switch the host if the ids match and call initiateRoom', () => {
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

        it('switchPlayerSocket should switch the client if the ids match and call initiateRoom', () => {
            const testRoom = new Room(oldPlayerSocket, roomsManager, {} as GameOptions);
            testRoom.clients[0] = socket;
            const initiateRoomStub = stub(testRoom, 'initiateRoomEvents').callsFake(() => {
                return;
            });
            const getRoomStub = stub(roomsManager, 'getRoom').callsFake(() => {
                return testRoom;
            });
            roomsManager.switchPlayerSocket(socket, newPlayerSocket);
            expect(getRoomStub.calledOnceWith(socket.id)).to.deep.equal(true);
            expect(testRoom.clients[0]).to.deep.equal(newPlayerSocket);
            expect(initiateRoomStub.calledOnce).to.deep.equal(true);
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
});
