/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { GameConfig } from '@app/classes/game-config';
import { Game } from '@app/classes/game/game';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Room } from '@app/classes/room';
import { expect } from 'chai';
import { GameOptions } from 'common/classes/game-options';
import { stringToLetter } from 'common/classes/letter';
import { Vec2 } from 'common/classes/vec2';
import { BOARD_SIZE } from 'common/constants';
import { stub, useFakeTimers } from 'sinon';
import io from 'socket.io';
import { CommandService } from './command.service';

describe('Individual functions', () => {
    let sockets: io.Socket[];
    const commandService = new CommandService();
    const gameConfig: GameConfig = new GameConfig('gameConfig', [], new Vec2(BOARD_SIZE, BOARD_SIZE));

    const createFakeSocket = (index: number) => {
        return {
            on: () => {
                return;
            },
            id: '1',
            emit: () => {
                return;
            },
            removeAllListeners: () => {
                return sockets[index];
            },
        } as unknown as io.Socket;
    };

    beforeEach(() => {
        sockets[0] = createFakeSocket(0);
        sockets[1] = createFakeSocket(1);
    });

    it('onCommand should call processCommand and postCommand', () => {
        const processStub = stub(commandService, 'processCommand').callsFake(() => {
            return;
        });
        const postCommandStub = stub(commandService, 'postCommand').callsFake(() => {
            return;
        });

        const game = {} as unknown as Game;

        commandService.onCommand(game, sockets, 'passer', 0);
        expect(processStub.calledOnce && postCommandStub.calledOnce).to.equal(true);
    });

    it('onCommand should call errorOnCommand if an error was thrown and gameEnded if game exists', () => {
        const processStub = stub(commandService, 'processCommand').callsFake(() => {
            throw new Error('Error de test');
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorOnCommandStub = stub(commandService as any, 'errorOnCommand').callsFake(() => {
            return;
        });

        let gameEndedCalled = false;
        const game = {
            needsToEnd: () => {
                gameEndedCalled = true;
                return false;
            },
        } as unknown as Game;

        commandService.onCommand(game, sockets, 'passer', 0);
        expect(processStub.calledOnce && gameEndedCalled && errorOnCommandStub.calledOnce).to.equal(true);
    });

    it('onCommand should call emit end game if gameEnded returns true', (done) => {
        sockets[0] = {
            emit: (event: string) => {
                expect(event === 'end game').to.equal(true);
                expect(processStub.calledOnce && errorOnCommandStub.calledOnce).to.equal(true);
                done();
                return;
            },
        } as unknown as io.Socket;

        const processStub = stub(commandService, 'processCommand').callsFake(() => {
            throw new Error('Error de test');
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorOnCommandStub = stub(commandService as any, 'errorOnCommand').callsFake(() => {
            return;
        });

        const game = {
            needsToEnd: () => {
                return true;
            },
            endGame: () => {
                return {
                    toEndGameStatus: () => {
                        return;
                    },
                };
            },
        } as unknown as Game;

        commandService.onCommand(game, sockets, 'passer', 0);
    });

    it('validate place validates correct arguments with one single letter placement', () => {
        let commandArgs = ['i7h', 'c'];
        expect(commandService['validatePlace'](gameConfig, commandArgs)).to.eq(true);
        commandArgs = ['i7v', 'c'];
        expect(commandService['validatePlace'](gameConfig, commandArgs)).to.eq(true);
        commandArgs = ['i7', 'c'];
        expect(commandService['validatePlace'](gameConfig, commandArgs)).to.eq(true);
    });

    it('validate place validates correct arguments', () => {
        let commandArgs = ['h7h', 'con'];
        expect(commandService['validatePlace'](gameConfig, commandArgs)).to.eq(true);
        commandArgs = ['h11h', 'con'];
        expect(commandService['validatePlace'](gameConfig, commandArgs)).to.eq(true);
    });

    it('parse place call returns the right placed characters', () => {
        const game = {} as unknown as Game;
        const commandArgs = ['h7h', 'con'];
        const placedLetters = commandService['parsePlaceCall'](game, commandArgs);
        placedLetters[0].forEach((l, index) => {
            expect(l).to.deep.eq(new PlacedLetter(stringToLetter(commandArgs[1][index]), new Vec2(6 + index, 7)));
        });
    });

    it('parse place call returns the right placed characters vertical edition', () => {
        const game = {} as unknown as Game;
        const commandArgs = ['g8v', 'con'];
        const placedLetters = commandService['parsePlaceCall'](game, commandArgs);
        placedLetters[0].forEach((l, index) => {
            expect(l).to.deep.eq(new PlacedLetter(stringToLetter(commandArgs[1][index]), new Vec2(7, 6 + index)));
        });
    });

    it('post command emits turn ended', (done) => {
        const clk = useFakeTimers();
        const game = {} as unknown as Game;
        sockets.pop();
        commandService.processSkip = () => done();
        commandService.postCommand(game, sockets);
        clk.tick(room.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
        clk.restore();
    });

    it('init timer should wait the right amount of ', (done) => {
        const clk = useFakeTimers();
        room.sockets.pop();
        room.processSkip = () => {
            return;
        };
        room.postCommand = () => done();
        room.initTimer();
        clk.tick(room.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
        clk.restore();
    });

    it('errorCommand should start a timer and call postCommand', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                expect(event).to.equal('error');
            },
        } as unknown as io.Socket;
        const clk = useFakeTimers();
        room.sockets.pop();
        room.postCommand = () => done();
        room.errorOnCommand(fakeSocket, new GameError(GameErrorType.InvalidWord));
        clk.tick(room.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
        clk.restore();
    });

    it('errorOnCommand should emit error', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                expect(event).to.equal('error');
                done();
            },
        } as unknown as io.Socket;
        room.errorOnCommand(fakeSocket, new Error('error'));
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
    it('post command emits turn ended', (done) => {
        room.sockets.pop();
        socket.emit = (namespace: string): boolean => {
            if (namespace === 'turn ended') done();
            return true;
        };
        room.postCommand();
    });

    describe('process command', () => {
        it('string with place calls processPlace', (done) => {
            room.processPlace = () => {
                done();
            };
            const fullCommand = 'placer h3h h';
            room.processCommand(fullCommand, game.activePlayer);
        });

        it('string with draw calls processDraw', (done) => {
            room.processDraw = () => {
                done();
            };
            const fullCommand = 'échanger abc';
            room.processCommand(fullCommand, game.activePlayer);
        });

        it('string with skip calls processSkip', (done) => {
            room.processSkip = () => {
                done();
            };
            const fullCommand = 'passer';
            room.processCommand(fullCommand, game.activePlayer);
        });

        it('string with place calls processPlace', () => {
            const fullCommand = 'placer h3h h';
            game.gameFinished = true;
            expect(() => room.processCommand(fullCommand, game.activePlayer)).to.throw();
        });
    });

    it('process place calls game place on correctly formed arguments', (done) => {
        game.place = () => {
            done();
        };
        const commandArgs = ['h7h', 'con'];
        room.processPlace(commandArgs, game.activePlayer);
    });

    it('processPlace not valid should emit an Error', () => {
        room.validatePlace = () => {
            return false;
        };
        expect(() => room.processPlace(['a'], 0)).to.throw();
    });

    it('processDraw with wrong arguments should throw an error', () => {
        expect(() => room.processDraw(['a8'], 0)).to.throw();
    });

    it('processSkip with arguments should throw an error', () => {
        expect(() => room.processSkip(['a', 'b'], 0)).to.throw();
    });

    it('ProcessSkip should emit skip success when player number is 0', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'skip success') done();
                return;
            },
        } as io.Socket;
        room.sockets = [fakeSocket];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room.game as any, 'skip').callsFake(() => {
            return;
        });
        room.processSkip([], 0);
    });

    it('ProcessSkip should emit skip success when player number is 1', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'skip success') done();
                return;
            },
        } as io.Socket;
        room.sockets = [fakeSocket];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room.game as any, 'skip').callsFake(() => {
            return;
        });
        room.processSkip([], 1);
    });

    it('processPlace should emit place success playerNumber is 1', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'place success') done();
                return;
            },
        } as io.Socket;
        room.sockets = [fakeSocket];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room as any, 'parsePlaceCall').callsFake(() => {
            return ['a', 'b'];
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room.game as any, 'place').callsFake(() => {
            return;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room as any, 'validatePlace').callsFake(() => {
            return true;
        });
        room.processPlace([], 1);
    });

    it('processPlace should emit place success when playerNumber is 0', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'place success') done();
                return;
            },
        } as io.Socket;
        room.sockets = [fakeSocket];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room as any, 'parsePlaceCall').callsFake(() => {
            return ['a', 'b'];
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room.game as any, 'place').callsFake(() => {
            return;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stub(room as any, 'validatePlace').callsFake(() => {
            return true;
        });
        room.processPlace([], 0);
    });

    it('validatePlace should return false if there is not two arguments', () => {
        expect(room.validatePlace(['a'])).to.equal(false);
    });

    it('validatePlace should return false if there is not two arguments', () => {
        const result = room.parsePlaceCall(['h7h', 'Ab']);
        expect(result[1].length).to.equal(1);
    });

    it('process draw calls game draw on correctly formed arguments', (done) => {
        game.draw = () => {
            done();
        };
        room.processDraw(['a'], 0);
    });

    it('process draw calls game draw on correctly formed arguments with another player number', (done) => {
        game.draw = () => {
            done();
        };
        room.processDraw(['a'], 1);
    });

    it('process skip calls game skip on correctly formed arguments', (done) => {
        game.skip = () => {
            done();
        };
        room.processSkip([], game.activePlayer);
    });
});
