import { expect } from 'chai';
import { createServer, Server } from 'http';
import { io as Client, Socket } from 'socket.io-client';
import io from 'socket.io';
import { Room } from '@app/classes/room';
import { Container } from 'typedi';
import { GameOptions } from './game-options';
import { RoomsManager } from '@app/services/rooms-manager.service';

const PORT = 3000;

describe('room', () => {
    let hostSocket: Socket;
    let clientSocket: Socket;
    let server: io.Server;
    let httpServer: Server;

    before((done) => {
        httpServer = createServer();
        httpServer.listen(PORT);
        server = new io.Server(httpServer);
        httpServer.on('listening', () => done());
    });

    beforeEach(() => {
        hostSocket = Client('http://localhost:3000');
        clientSocket = Client('http://localhost:3000');
    });

    afterEach(() => {
        server.removeAllListeners();
    });

    after(() => {
        server.close();
        httpServer.close();
    });

    it('constructor', (done) => {
        let room: Room;
        const gameOptions = new GameOptions('a', 'b');
        server.on('connection', (socket) => {
            socket.on('create room', () => {
                room = new Room(socket, new RoomsManager(), gameOptions);
                expect(room.clients.length).to.eq(1);
                expect(room.gameOptions).to.eq(gameOptions);
                expect(room.host).to.eq(socket);
                expect(room.started).to.eq(false);
                done();
            });
        });
        hostSocket.emit('create room');
    });

    it('quit', (done) => {
        let room: Room;
        const roomsManager = new RoomsManager();
        const gameOptions = new GameOptions('a', 'b');
        roomsManager.removeRoom = (roomIn: Room) => {
            expect(roomIn).to.deep.eq(room);
            done();
        };
        server.on('connection', (socket) => {
            socket.on('create room', () => {
                room = new Room(socket, roomsManager, gameOptions);
            });
        });
        hostSocket.emit('create room');
        hostSocket.emit('quit');
        expect(Container.get(RoomsManager).rooms.length).to.eq(0);
    });

    it('join', (done) => {
        let room: Room;
        const roomsManager = new RoomsManager();
        const gameOptions = new GameOptions('a', 'b');
        server.on('connection', (socket) => {
            socket.on('create room', () => {
                room = new Room(socket, roomsManager, gameOptions);
            });
            socket.on('join', () => {
                room.join(socket, 'player 2');
                expect(room.clients[0]).to.eq(socket);
            });
        });
        hostSocket.on('player joining', (name) => {
            expect(name).to.eq('player 2');
            done();
        });
        hostSocket.emit('create room');
        clientSocket.emit('join');
    });

    it('accept', (done) => {
        let room: Room;
        const roomsManager = new RoomsManager();
        const gameOptions = new GameOptions('a', 'b');
        server.on('connection', (socket) => {
            socket.on('create room', () => {
                room = new Room(socket, roomsManager, gameOptions);
            });
            socket.on('join', () => {
                room.join(socket, 'player 2');
                expect(room.clients[0]).to.eq(socket);
            });
        });
        hostSocket.on('player joining', (name) => {
            expect(name).to.eq('player 2');
            hostSocket.emit('accept');
        });
        clientSocket.on('accepted', () => {
            done();
        });
        hostSocket.emit('create room');
        clientSocket.emit('join');
    });

    it('accept', (done) => {
        let room: Room;
        const roomsManager = new RoomsManager();
        const gameOptions = new GameOptions('a', 'b');
        server.on('connection', (socket) => {
            socket.on('create room', () => {
                room = new Room(socket, roomsManager, gameOptions);
            });
            socket.on('join', () => {
                room.join(socket, 'player 2');
                expect(room.clients[0]).to.eq(socket);
            });
        });
        hostSocket.on('player joining', (name) => {
            expect(name).to.eq('player 2');
            hostSocket.emit('refuse');
        });
        clientSocket.on('refused', () => {
            expect(room.clients[0]).to.eq(null);
            done();
        });
        hostSocket.emit('create room');
        clientSocket.emit('join');
    });

    it('client quit', (done) => {
        let room: Room;
        const roomsManager = new RoomsManager();
        const gameOptions = new GameOptions('a', 'b');
        roomsManager.removeRoom = (roomIn: Room) => {
            expect(roomIn).to.deep.eq(room);
            done();
        };
        server.on('connection', (socket) => {
            socket.on('create room', () => {
                room = new Room(socket, roomsManager, gameOptions);
            });
            socket.on('join', () => {
                room.join(socket, 'player 2');
                expect(room.clients[0]).to.eq(socket);
            });
        });
        hostSocket.on('player joining', (name) => {
            expect(name).to.eq('player 2');
            hostSocket.emit('accept');
        });
        clientSocket.on('accepted', () => {
            clientSocket.emit('quit');
        });
        hostSocket.emit('create room');
        clientSocket.emit('join');
    });
});
