/* eslint-disable max-lines */
import { Room } from '@app/classes/room';
import { PORT, RESPONSE_DELAY } from '@app/environnement.json';
import { RoomsManager } from '@app/services/rooms-manager.service';
import { fail } from 'assert';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { createStubInstance, SinonStub, SinonStubbedInstance, stub } from 'sinon';
import io from 'socket.io';
import { io as Client, Socket } from 'socket.io-client';
import { GameOptions } from './game-options';
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

        it('inviteRefused should set remove the client from the room', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            room.clients[0] = socket;
            room.inviteRefused(socket);
            expect(room.clients[0]).to.deep.equal(null);
        });

        it('quitRoomClient should call RoomsManager.removeRoom', (done) => {
            roomsManager.removeRoom.callsFake(() => done());
            const room = new Room(socket, roomsManager, gameOptions);
            room.quitRoomClient();
        });

        it('join should add the client to the clients list', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            room.join(socket, 'Player 2');
            expect(room.clients[0]).to.deep.equal(socket);
        });

        it('surrenderGame should throw error if the game is null', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            try {
                room.surrenderGame(socket.id);
            } catch (error) {
                expect(error.message).to.deep.equal('Game does not exist');
            }
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
            room.game = { players: ['player1', 'player2'] } as unknown as Game;
            room.sockets = [clientSocket, hostSocket];
            room.surrenderGame(socket.id);
            room.surrenderGame('player2');
            setTimeout(() => {
                expect(clientReceived && hostReceived).to.deep.equal(true);
                done();
            }, RESPONSE_DELAY * 3);
        });

        it('removeUnneededListeners should remove the listeners that are going to be reinstated', () => {
            const room = new Room(socket, roomsManager, gameOptions);
            const socketStub = stub(socket, 'removeAllListeners').callThrough();
            room.removeUnneededListeners(socket);
            expect(socketStub.calledWith('send message')).to.equal(true);
            expect(socketStub.calledWith('surrender game')).to.equal(true);
            expect(socketStub.calledWith('get game status')).to.equal(true);
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
                const message = { username: 'Hostname', message: 'Host Message' };
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
                const message = { username: 'ClientName', message: 'Client Message' };
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

            it('initChatting should not initiate the client socket if clients[0] is null', (done) => {
                hostSocket.on('player joining', () => {
                    room.clients[0] = null;
                    room.initChatting();
                    hostSocket.emit('send message', { username: 'player', message: 'message' });
                });
                clientSocket.on('receive message', () => {
                    fail('Client should not receive message');
                });
                hostSocket.emit('create room');
                setTimeout(() => {
                    done();
                }, RESPONSE_DELAY);
            });

            /* it('surrenderGame should emit endGame if the game is not null', (done) => {
                hostSocket.on('player joining', () => {
                    hostSocket.emit('accept');
                });
                clientSocket.on('accepted', () => {
                    hostSocket.emit('surrender game');
                });
                room.game = { players: ['player1', 'player2'] } as unknown as Game;
                let clientReceived = false;
                let hostReceived = false;
                hostSocket.on('end game', (data) => {
                    hostReceived = true;
                    expect(data.winner).to.equal('player2');
                });
                clientSocket.on('end game', (data) => {
                    clientReceived = true;
                    expect(data.winner).to.equal('player2');
                });
                setTimeout(() => {
                    expect(clientReceived && hostReceived).to.deep.equal(true);
                    done();
                }, RESPONSE_DELAY * 3);
            });*/
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
                    clientSocket.emit('quit');
                });
                hostSocket.emit('create room');
            });

            // it('should handle surrender game from client and call endGame', (done) => {
            //     let room: Room;
            //     const gameOptions = new GameOptions('player 1', 'b');
            //     server.on('connection', (socket) => {
            //         socket.on('create room', () => {
            //             room = new Room(socket, roomsManager, gameOptions);
            //             const endGameSpy = spy(room, 'endGame');
            //             setTimeout(() => {
            //                 expect(endGameSpy.called).to.equal(true);
            //                 done();
            //             }, RESPONSE_DELAY);
            //             clientSocket.emit('join');
            //         });
            //         socket.on('join', () => {
            //             room.join(socket, 'player 2');
            //             room.inviteAccepted(socket);
            //             clientSocket.emit('surrender game');
            //         });
            //     });
            //     hostSocket.emit('create room');
            // });
            // it('should handle surrender game from host and call endGame', (done) => {
            //     let room: Room;
            //     const gameOptions = new GameOptions('player 1', 'b');
            //     server.on('connection', (socket) => {
            //         socket.on('create room', () => {
            //             room = new Room(socket, roomsManager, gameOptions);
            //             const endGameSpy = spy(room, 'endGame');
            //             setTimeout(() => {
            //                 expect(endGameSpy.called).to.equal(true);
            //                 done();
            //             }, RESPONSE_DELAY);
            //             clientSocket.emit('join');
            //         });
            //         socket.on('join', () => {
            //             room.join(socket, 'player 2');
            //             room.inviteAccepted(socket);
            //             hostSocket.emit('surrender game');
            //         });
            //     });
            //     hostSocket.emit('create room');
            // });
            // it('should receive end game namespace with given info', (done) => {
            //     const finishStatus = new GameFinishStatus([], null);
            //     let room: Room;
            //     const gameOptions = new GameOptions('a', 'b');
            //     server.on('connection', (socket) => {
            //         socket.on('create room', () => {
            //             room = new Room(socket, roomsManager, gameOptions);
            //         });
            //         socket.on('join', () => {
            //             room.join(socket, 'player 2');
            //         });
            //     });
            //     hostSocket.on('end game', (receivedStatus: GameFinishStatus) => {
            //         expect(receivedStatus).to.deep.eq(finishStatus);
            //         done();
            //     });
            //     hostSocket.on('player joining', () => {
            //         hostSocket.emit('accept');
            //     });
            //     clientSocket.on('game status', () => {
            //         room.endGame(finishStatus);
            //     });
            //     hostSocket.emit('create room');
            //     clientSocket.emit('join');
            //     clientSocket.emit('get game status');
            // });
        });
    });
});
