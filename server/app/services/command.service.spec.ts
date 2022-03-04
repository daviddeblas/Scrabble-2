/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { GameConfig } from '@app/classes/game-config';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Board } from '@app/classes/game/board';
import { Game, MILLISECONDS_PER_SEC } from '@app/classes/game/game';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Room } from '@app/classes/room';
import { expect } from 'chai';
import { GameOptions } from 'common/classes/game-options';
import { stringToLetter } from 'common/classes/letter';
import { Vec2 } from 'common/classes/vec2';
import { BOARD_SIZE } from 'common/constants';
import { stub, useFakeTimers } from 'sinon';
import io from 'socket.io';
import Container from 'typedi';
import { CommandService } from './command.service';
import { RoomsManager } from './rooms-manager.service';

describe('Individual functions', () => {
    let sockets: io.Socket[];
    let commandService: CommandService;
    const gameConfig: GameConfig = new GameConfig('gameConfig', [], new Vec2(BOARD_SIZE, BOARD_SIZE));
    const gameOptions: GameOptions = new GameOptions('host', 'dict', 60);

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
        commandService = new CommandService();
        sockets = [];
        sockets.push(createFakeSocket(0));
        sockets.push(createFakeSocket(1));
    });

    it('onCommand should call processCommand and postCommand', () => {
        const processStub = stub(commandService, 'processCommand').callsFake(() => {
            return;
        });
        const postCommandStub = stub(commandService, 'postCommand').callsFake(() => {
            return;
        });

        const game = {
            needsToEnd: () => true,
            endGame: () => {
                return {
                    toEndGameStatus: () => {
                        return;
                    },
                };
            },
        } as unknown as Game;

        commandService.onCommand(game, sockets, 'passer', 0);
        expect(processStub.calledOnce && postCommandStub.calledOnce).to.equal(true);
    });

    it('onCommand should call errorOnCommand if an error was thrown and gameEnded if game exists', () => {
        const processStub = stub(commandService, 'processCommand').callsFake(() => {
            throw new Error('Error de test');
        });
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
        const game = { board: new Board(gameConfig) } as unknown as Game;
        const commandArgs = ['h7h', 'con'];
        const placedLetters = commandService['parsePlaceCall'](game, commandArgs);
        placedLetters[0].forEach((l, index) => {
            expect(l).to.deep.eq(new PlacedLetter(stringToLetter(commandArgs[1][index]), new Vec2(6 + index, 7)));
        });
    });

    it('parse place call returns the right placed characters vertical edition', () => {
        const game = { board: new Board(gameConfig) } as unknown as Game;
        const commandArgs = ['g8v', 'con'];
        const placedLetters = commandService['parsePlaceCall'](game, commandArgs);
        placedLetters[0].forEach((l, index) => {
            expect(l).to.deep.eq(new PlacedLetter(stringToLetter(commandArgs[1][index]), new Vec2(7, 6 + index)));
        });
    });

    it('errorCommand should start a timer and call postCommand', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                expect(event).to.equal('error');
            },
        } as unknown as io.Socket;
        const game = {
            stopTimer: () => {
                return;
            },
            nextTurn: () => {
                return;
            },
            gameOptions,
        } as unknown as Game;
        const clk = useFakeTimers();
        const playerNumber = 1;
        sockets[playerNumber] = fakeSocket;
        commandService.postCommand = () => done();
        commandService['errorOnCommand'](game, sockets, new GameError(GameErrorType.InvalidWord), playerNumber);
        clk.tick(game.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
        clk.restore();
    });

    it('errorOnCommand should emit error', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                expect(event).to.equal('error');
                done();
            },
        } as unknown as io.Socket;
        const game = {} as unknown as Game;
        const playerNumber = 0;
        sockets[playerNumber] = fakeSocket;
        commandService['errorOnCommand'](game, sockets, new Error('error'), playerNumber);
    });
});

describe('commands', () => {
    let commandService: CommandService;
    let room: Room;
    let sockets: io.Socket[];
    let gameOptions: GameOptions;
    let game: Game;

    const createFakeSocket = (index: number) => {
        return {
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
            removeAllListeners: () => {
                return sockets[index];
            },
        } as unknown as io.Socket;
    };

    beforeEach(() => {
        sockets = [];
        sockets.push(createFakeSocket(0));
        sockets.push(createFakeSocket(1));

        gameOptions = new GameOptions('a', 'b');
        commandService = new CommandService();

        room = new Room(sockets[0], Container.get(RoomsManager), gameOptions);
        room.join(sockets[1], 'player 2');
        room.inviteAccepted(sockets[1]);
        game = room.game as Game;
    });

    it('post command emits turn ended', (done) => {
        room.sockets.pop();
        room.sockets[0].emit = (namespace: string): boolean => {
            if (namespace === 'turn ended') done();
            return true;
        };
        commandService['postCommand'](game, room.sockets);
    });

    describe('process command', () => {
        it('string with place calls processPlace', (done) => {
            commandService.processPlace = () => {
                done();
            };
            const fullCommand = 'placer h3h h';
            commandService.processCommand(game, room.sockets, fullCommand, game.activePlayer);
        });

        it('string with draw calls processDraw', (done) => {
            commandService.processDraw = () => {
                done();
            };
            const fullCommand = 'échanger abc';
            commandService.processCommand(game, room.sockets, fullCommand, game.activePlayer);
        });

        it('string with skip calls processSkip', (done) => {
            commandService.processSkip = () => {
                done();
            };
            const fullCommand = 'passer';
            commandService.processCommand(game, room.sockets, fullCommand, game.activePlayer);
        });

        it('string with place calls processPlace', () => {
            const fullCommand = 'placer h3h h';
            game.gameFinished = true;
            expect(() => commandService.processCommand(game, room.sockets, fullCommand, game.activePlayer)).to.throw();
        });
    });

    it('process place calls game place on correctly formed arguments', (done) => {
        game.place = () => {
            done();
        };
        const commandArgs = ['h7h', 'con'];
        commandService.processPlace(game, room.sockets, commandArgs, game.activePlayer);
    });

    it('processPlace not valid should emit an Error', () => {
        commandService['validatePlace'] = () => {
            return false;
        };
        expect(() => commandService.processPlace(game, room.sockets, ['a'], 0)).to.throw();
    });

    it('processDraw with wrong arguments should throw an error', () => {
        expect(() => commandService.processDraw(game, room.sockets, ['a8'], 0)).to.throw();
    });

    it('processSkip with arguments should throw an error', () => {
        expect(() => commandService.processSkip(game, room.sockets, ['a', 'b'], 0)).to.throw();
    });

    it('ProcessSkip should emit skip success when player number is 0', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'skip success') done();
                return;
            },
        } as io.Socket;
        room.sockets[0] = fakeSocket;
        stub(room.game as any, 'skip').callsFake(() => {
            return;
        });
        commandService.processSkip(game, room.sockets, [], 0);
    });

    it('ProcessSkip should emit skip success when player number is 1', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'skip success') done();
                return;
            },
        } as io.Socket;
        room.sockets[1] = fakeSocket;
        stub(game as any, 'skip').callsFake(() => {
            return;
        });
        commandService.processSkip(game, room.sockets, [], 1);
    });

    it('processPlace should emit place success playerNumber is 1', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'place success') done();
                return;
            },
        } as io.Socket;
        room.sockets = [fakeSocket];
        stub(commandService as any, 'parsePlaceCall').callsFake(() => {
            return ['a', 'b'];
        });
        stub(room.game as any, 'place').callsFake(() => {
            return;
        });
        stub(commandService as any, 'validatePlace').callsFake(() => {
            return true;
        });
        commandService.processPlace(game, room.sockets, [], 1);
    });

    it('processPlace should emit place success when playerNumber is 0', (done) => {
        const fakeSocket = {
            emit: (event: string) => {
                if (event === 'place success') done();
                return;
            },
        } as io.Socket;
        room.sockets = [fakeSocket];
        stub(commandService as any, 'parsePlaceCall').callsFake(() => {
            return ['a', 'b'];
        });
        stub(room.game as any, 'place').callsFake(() => {
            return;
        });
        stub(commandService as any, 'validatePlace').callsFake(() => {
            return true;
        });
        commandService.processPlace(game, room.sockets, [], 0);
    });

    it('validatePlace should return false if there is not two arguments', () => {
        expect(commandService['validatePlace'](game.config, ['a'])).to.equal(false);
    });

    it('validatePlace should return false if there is not two arguments', () => {
        const result = commandService['parsePlaceCall'](game, ['h7h', 'Ab']);
        expect(result[1].length).to.equal(1);
    });

    it('process draw calls game draw on correctly formed arguments', (done) => {
        game.draw = () => {
            done();
        };
        commandService.processDraw(game, room.sockets, ['a'], 0);
    });

    it('process draw calls game draw on correctly formed arguments with another player number', (done) => {
        game.draw = () => {
            done();
        };
        commandService.processDraw(game, room.sockets, ['a'], 1);
    });

    it('process skip calls game skip on correctly formed arguments', (done) => {
        game.skip = () => {
            done();
        };
        commandService.processSkip(game, room.sockets, [], game.activePlayer);
    });
});
