/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { Room } from '@app/classes/room';
import { PORT, RESPONSE_DELAY } from '@app/environnement.json';
import { CommandService } from '@app/services/command.service';
import { RoomsManager } from '@app/services/rooms-manager.service';
import { expect } from 'chai';
import { GameOptions } from 'common/classes/game-options';
import { createServer, Server } from 'http';
import { createStubInstance, SinonStub, SinonStubbedInstance, stub } from 'sinon';
import io from 'socket.io';
import { io as Client, Socket } from 'socket.io-client';
import { Game } from './game/game';

describe('room', () => {
    let roomsManager: SinonStubbedInstance<RoomsManager>;
    beforeEach(() => {
        roomsManager = createStubInstance(RoomsManager);
    });

    describe('Individual functions', () => {
        let socket: io.Socket;
        let gameOptions: GameOptions;
        beforeEach(() => {
            socket = {
                once: () => {
                    return;
                },
                id: '1',
                emit: () => {
                    return;
                },
                removeAllListeners: () => {
                    return socket;
                },
            } as unknown as io.Socket;
            gameOptions = new GameOptions('a', 'b');
        });

        it('constructor should create a Room', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            expect(room.clients.length).to.eq(1);
            expect(room.gameOptions).to.eq(gameOptions);
            expect(room.host).to.eq(socket);
            expect(room.started).to.eq(false);
            socket.emit('quit');
        });

        it('quitRoomHost should call RoomsManager.removeRoom', (done) => {
            roomsManager.removeRoom.callsFake(() => done());
            const room = new Room(socket, roomsManager, gameOptions);
            room.quitRoomHost();
        });

        it('quitRoomHost should call RoomsManager.removeRoom', (done) => {
            const room = new Room(socket, roomsManager, gameOptions);
            room.clients[0] = { id: '1' } as unknown as io.Socket;
            stub(room, 'inviteRefused').callsFake(() => {
                return done();
            });
            room.quitRoomHost();
        });

        it('inviteRefused should set remove the client from the room', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            room.clients[0] = socket;
            room.inviteRefused(socket);
            expect(room.clients[0]).to.deep.equal(null);
        });

        it('quitRoomClient should call RoomsManager.removeRoom', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            room.clients[0] = socket;
            room.quitRoomClient();
            expect(room.clients[0]).to.equal(null);
        });

        it('join should add the client to the clients list', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            room.join(socket, 'Player 2');
            expect(room.clients[0]).to.deep.equal(socket);
        });

        it('surrenderGame should throw error if the game is null', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            expect(() => room.surrenderGame(socket.id)).to.throw();
        });

        it('surrenderGame should emit endGame if the game is not null', (done) => {
            const room = new Room(socket, roomsManager, gameOptions);
            let clientReceived = false;
            const clientSocket = {
                emit: () => {
                    clientReceived = true;
                },
            } as unknown as io.Socket;
            let hostReceived = false;
            const hostSocket = {
                emit: () => {
                    hostReceived = true;
                },
            } as unknown as io.Socket;
            room.game = {
                players: ['player1', 'player2'],
                bag: { letters: [] },
                stopTimer: () => {
                    return;
                },
                endGame: () => {
                    return;
                },
            } as unknown as Game;
            room.sockets = [clientSocket, hostSocket];
            room.surrenderGame(socket.id);
            room.surrenderGame('player2');
            setTimeout(() => {
                expect(clientReceived && hostReceived).to.deep.equal(true);
                done();
            }, RESPONSE_DELAY * 3);
        });

        it('surrenderGame should call RoomsManager.removeRoom if no players are left', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            room['playersLeft'] = 0;
            room.game = {
                players: ['player1', 'player2'],
                bag: { letters: [] },
                stopTimer: () => {
                    return;
                },
                endGame: () => {
                    return;
                },
            } as unknown as Game;
            room.sockets = [];
            room.surrenderGame('socket id');
            expect(roomsManager.removeRoom.calledOnce).to.equal(true);
        });

        it('removeUnneededListeners should remove the listeners that are going to be reinstated', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            const socketStub = stub(socket, 'removeAllListeners').callThrough();
            room.removeUnneededListeners(socket);
            expect(socketStub.calledWith('send message')).to.equal(true);
            expect(socketStub.calledWith('surrender game')).to.equal(true);
            expect(socketStub.calledWith('get game status')).to.equal(true);
        });

        it('quitRoomClient should not emit if game is not null', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            room.game = {} as unknown as Game;
            const emitStub = stub(socket, 'emit').callsFake(() => {
                return true;
            });
            room.quitRoomClient();
            expect(emitStub.called).to.equal(false);
        });

        it('initiateRoomEvents should call setupSocket', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setupSocketStub = stub(room as any, 'setupSocket').callsFake(() => {
                return;
            });
            room.clients[0] = {} as io.Socket;
            room.initiateRoomEvents();
            expect(setupSocketStub.called).to.equal(true);
        });

        it('actionAfterTimeout should call processSkip and postCommand', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            const commandServiceStub = {
                processSkip: stub(),
                postCommand: stub(),
            };
            room['commandService'] = commandServiceStub as unknown as CommandService;
            room['game'] = { activePlayer: 0, needsToEnd: () => false } as unknown as Game;
            room['actionAfterTimeout'](room)();
            expect(commandServiceStub.processSkip.calledOnce).to.equal(true);
            expect(commandServiceStub.postCommand.calledOnce).to.equal(true);
        });

        it('actionAfterTimeout should call end game if game is ended', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            const stubbedGame = {
                needsToEnd: () => true,
                skip: () => {
                    return;
                },
            } as unknown as Game;
            stub(room.commandService, 'processSkip').callsFake(() => {
                return;
            });
            stub(room.commandService, 'postCommand').callsFake(() => {
                return;
            });
            room.game = stubbedGame;
            const endGame = stub(room.commandService, 'endGame');
            room['actionAfterTimeout'](room)();
            expect(endGame.calledOnce).to.equal(true);
        });
    });

    describe('Room events', () => {
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

        describe('Emitting', () => {
            let room: Room;

            beforeEach(() => {
                const gameOptions = new GameOptions('a', 'b');
                server.on('connection', (socket) => {
                    socket.on('create room', () => {
                        room = new Room(socket, roomsManager, gameOptions);
                        clientSocket.emit('join');
                    });
                    socket.on('join', () => {
                        room.join(socket, 'player 2');
                    });
                });
            });

            it('join emits player joining event', (done) => {
                hostSocket.on('player joining', (name) => {
                    expect(name).to.eq('player 2');
                    done();
                });
                hostSocket.emit('create room');
            });

            it('client should receive refused if host refuses', (done) => {
                hostSocket.on('player joining', () => {
                    hostSocket.emit('refuse');
                });
                clientSocket.on('refused', () => {
                    expect(room.clients[0]).to.eq(null);
                    done();
                });
                hostSocket.emit('create room');
            });

            it('client should receive accepted if host accepts', (done) => {
                hostSocket.on('player joining', () => {
                    hostSocket.emit('accept');
                });
                clientSocket.on('accepted', () => {
                    done();
                });
                hostSocket.emit('create room');
            });

            it('client should receive message if host emits send message', (done) => {
                const message = { username: 'Hostname', message: 'Host Message', messageType: '' };
                hostSocket.on('player joining', () => {
                    hostSocket.emit('accept');
                    hostSocket.emit('send message', message);
                });
                clientSocket.on('receive message', (data) => {
                    expect(data.username).to.equal(message.username);
                    expect(data.message).to.equal(message.message);
                    done();
                });
                hostSocket.emit('create room');
            });

            it('host should receive message if client emits send message', (done) => {
                const message = { username: 'ClientName', message: 'Client Message', messageType: '' };
                hostSocket.on('player joining', () => {
                    hostSocket.emit('accept');
                    clientSocket.emit('send message', message);
                });
                hostSocket.on('receive message', (data) => {
                    expect(data.username).to.equal(message.username);
                    expect(data.message).to.equal(message.message);
                    done();
                });
                hostSocket.emit('create room');
            });

            it('should call removeRoom if no players are left when quit message sent', (done) => {
                const message = { username: '', message: 'Player1 a quitté le jeu', messageType: 'System' };
                hostSocket.on('player joining', () => {
                    room['playersLeft'] = 1;
                    hostSocket.emit('accept');
                    clientSocket.emit('send message', message);
                });
                setTimeout(() => {
                    expect(roomsManager.removeRoom.calledOnce).to.equal(true);
                    done();
                }, RESPONSE_DELAY);
                hostSocket.emit('create room');
            });

            it('should not call removeRoom if players are left when quit message sent', (done) => {
                const message = { username: '', message: 'Player1 a quitté le jeu', messageType: 'System' };
                hostSocket.on('player joining', () => {
                    room['playersLeft'] = 2;
                    hostSocket.emit('accept');
                    clientSocket.emit('send message', message);
                });
                setTimeout(() => {
                    expect(roomsManager.removeRoom.calledOnce).to.equal(false);
                    done();
                }, RESPONSE_DELAY);
                hostSocket.emit('create room');
            });

            it('initSurrenderGame should enable the surrender event which calls surrenderGame', (done) => {
                let surrenderGameStub: SinonStub;
                hostSocket.on('player joining', () => {
                    surrenderGameStub = stub(room, 'surrenderGame').callsFake(() => {
                        return;
                    });
                    hostSocket.emit('accept');
                });
                clientSocket.on('accepted', () => {
                    hostSocket.emit('surrender game');
                });
                hostSocket.emit('create room');
                setTimeout(() => {
                    expect(surrenderGameStub.called).to.equal(true);
                    surrenderGameStub.restore();
                    done();
                }, RESPONSE_DELAY);
            });
        });

        describe('getGameInfo', () => {
            it('client should receive game info when requested', (done) => {
                let room: Room;
                const gameOptions = new GameOptions('a', 'b');
                server.on('connection', (socket) => {
                    socket.on('create room', () => {
                        room = new Room(socket, roomsManager, gameOptions);
                        clientSocket.emit('join');
                    });
                    socket.on('join', () => {
                        room.join(socket, 'player 2');
                    });
                });

                clientSocket.on('accepted', () => {
                    clientSocket.emit('get game status');
                });
                hostSocket.on('player joining', () => {
                    hostSocket.emit('accept');
                });
                clientSocket.on('game status', () => {
                    done();
                });
                hostSocket.emit('create room');
            });
        });

        describe('Receiving', () => {
            it('quit should call quitRoomHost() when emitted', (done) => {
                const gameOptions = new GameOptions('player 1', 'b');
                server.on('connection', (socket) => {
                    socket.on('create room', () => {
                        const room = new Room(socket, roomsManager, gameOptions);
                        const quitRoomHostStub = stub(room, 'quitRoomHost');
                        hostSocket.emit('quit');
                        setTimeout(() => {
                            expect(quitRoomHostStub.calledOnce).to.deep.equal(true);
                            done();
                        }, RESPONSE_DELAY);
                    });
                });
                hostSocket.emit('create room');
            });

            it('accept should call inviteAccepted()', (done) => {
                let room: Room;
                const gameOptions = new GameOptions('player 1', 'b');
                server.on('connection', (socket) => {
                    socket.on('create room', () => {
                        room = new Room(socket, roomsManager, gameOptions);
                        const inviteAcceptedStub = stub(room, 'inviteAccepted');
                        room.join(socket, 'player 2');
                        hostSocket.emit('accept');
                        setTimeout(() => {
                            expect(inviteAcceptedStub.calledOnce).to.deep.equal(true);
                            done();
                        }, RESPONSE_DELAY);
                    });
                });
                hostSocket.emit('create room');
            });

            it('client quit should call quitRoomClient', (done) => {
                let room: Room;
                const gameOptions = new GameOptions('player 1', 'b');
                roomsManager.removeRoom.callsFake(() => {
                    return;
                });
                server.on('connection', (socket) => {
                    socket.on('create room', () => {
                        room = new Room(socket, roomsManager, gameOptions);
                        const quitRoomClientStub = stub(room, 'quitRoomClient');
                        clientSocket.emit('join');
                        setTimeout(() => {
                            expect(quitRoomClientStub.calledOnce).to.deep.equal(true);
                            done();
                        }, RESPONSE_DELAY);
                    });
                    socket.on('join', () => {
                        room.join(socket, 'player 2');
                    });
                });
                hostSocket.on('player joining', () => {
                    clientSocket.emit('cancel join room');
                });
                hostSocket.emit('create room');
            });
        });
    });
});
