/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { MILLISECONDS_PER_SEC, Room } from '@app/classes/room';
import { PORT, RESPONSE_DELAY } from '@app/environnement.json';
import { RoomsManager } from '@app/services/rooms-manager.service';
import { expect } from 'chai';
import { createServer, Server } from 'http';
import { createStubInstance, SinonStubbedInstance, stub, useFakeTimers } from 'sinon';
import io from 'socket.io';
import { io as Client, Socket } from 'socket.io-client';
import { GameOptions } from './game-options';
import { Game, MAX_LETTERS_IN_EASEL } from './game/game';
import { stringToLetter } from './letter';
import { PlacedLetter } from './placed-letter';
import { Vec2 } from './vec2';

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
    });

    describe('Command parsing functions and validations', () => {
        let room: Room;
        let socket: io.Socket;
        let gameOptions: GameOptions;
        beforeEach(() => {
            socket = {
                once: () => {
                    return;
                },
                on: () => {
                    return;
                },
                id: '1',
                emit: () => {
                    return;
                },
            } as unknown as io.Socket;
            gameOptions = new GameOptions('a', 'b');

            room = new Room(socket, roomsManager, gameOptions);
            room.join(socket, 'player 2');
            room.inviteAccepted(socket);
        });

        it('validate place validates correct arguments with one single letter placement', () => {
            let commandArgs = ['i7h', 'c'];
            expect(room['validatePlace'](commandArgs)).to.eq(true);
            commandArgs = ['i7v', 'c'];
            expect(room['validatePlace'](commandArgs)).to.eq(true);
            commandArgs = ['i7', 'c'];
            expect(room['validatePlace'](commandArgs)).to.eq(true);
        });

        it('validate place validates correct arguments', () => {
            let commandArgs = ['h7h', 'con'];
            expect(room['validatePlace'](commandArgs)).to.eq(true);
            commandArgs = ['h11h', 'con'];
            expect(room['validatePlace'](commandArgs)).to.eq(true);
        });

        it('parse place call returns the right placed characters', () => {
            const commandArgs = ['h7h', 'con'];
            const placedLetters = room['parsePlaceCall'](commandArgs);
            placedLetters.forEach((l, index) => {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                expect(l).to.deep.eq(new PlacedLetter(stringToLetter(commandArgs[1][index]), new Vec2(6 + index, 7)));
            });
        });

        it('game status getter returns specific information given to the player', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const info = room['gameStatusGetter'](0) as any;
            expect(info.playerNames).to.deep.eq(['a', 'player 2']);
            expect(info.thisPlayer).to.eq(0);
            expect(info.playerEasel.length).to.eq(MAX_LETTERS_IN_EASEL);
            expect(info.board).to.deep.eq(room.game?.board);
            expect(info.activePlayer).to.eq(room.game?.activePlayer);
            expect(info.letterPotLength).to.eq(room.game?.bag.letters.length);
        });
    });

    describe('commands', () => {
        let room: Room;
        let socket: io.Socket;
        let gameOptions: GameOptions;
        let game: Game;
        beforeEach(() => {
            socket = {
                once: () => {
                    return;
                },
                on: () => {
                    return;
                },
                id: '1',
                emit: () => {
                    return;
                },
            } as unknown as io.Socket;
            gameOptions = new GameOptions('a', 'b');

            room = new Room(socket, roomsManager, gameOptions);
            room.join(socket, 'player 2');
            room.inviteAccepted(socket);
            game = room.game as Game;
        });

        afterEach(() => clearTimeout(room.currentTimer));

        it('post command emits turn ended', (done) => {
            room.sockets.pop();
            socket.emit = (namespace: string): boolean => {
                if (namespace === 'turn ended') done();
                return true;
            };
            room['postCommand']();
        });

        it('post command emits turn ended', (done) => {
            const clk = useFakeTimers();
            room.sockets.pop();
            room['processSkip'] = () => done();
            room['postCommand']();
            clk.tick(room.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
            clk.restore();
        });

        describe('process command', () => {
            it('string with place calls processPlace', (done) => {
                room['processPlace'] = () => {
                    done();
                };
                const fullCommand = 'place h3h h';
                room['processCommand'](fullCommand, game.activePlayer);
            });

            it('string with draw calls processDraw', (done) => {
                room['processDraw'] = () => {
                    done();
                };
                const fullCommand = 'échanger abc';
                room['processCommand'](fullCommand, game.activePlayer);
            });

            it('string with skip calls processSkip', (done) => {
                room['processSkip'] = () => {
                    done();
                };
                const fullCommand = 'passer';
                room['processCommand'](fullCommand, game.activePlayer);
            });
        });

        it('process place calls game place on correctly formed arguments', (done) => {
            game.place = () => {
                done();
            };
            const commandArgs = ['h7h', 'con'];
            room['processPlace'](commandArgs, game.activePlayer);
        });

        it('process draw calls game draw on correctly formed arguments', (done) => {
            game.draw = () => {
                done();
            };
            room['processDraw'](['a'], game.activePlayer);
        });

        it('process skip calls game skip on correctly formed arguments', (done) => {
            game.skip = () => {
                done();
            };
            room['processSkip']([], game.activePlayer);
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
                const gameOptions = new GameOptions('a', 'b');
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
                const gameOptions = new GameOptions('a', 'b');
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
                const gameOptions = new GameOptions('a', 'b');
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
        });
    });
});
