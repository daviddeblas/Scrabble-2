/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { BLANK_LETTER, Letter, stringToLetters } from '@app/classes/letter';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';
import { GameConfigService } from '@app/services/game-config.service';
import { expect } from 'chai';
import Container from 'typedi';
import { BONUS_POINTS_FOR_FULL_EASEL, Game, MAX_LETTERS_IN_EASEL } from './game';

describe('game', () => {
    let game: Game;
    let activePlayer: number;

    beforeEach(() => {
        game = new Game(Container.get(GameConfigService).configs.configs[0], ['player 1', 'player 2']);
        activePlayer = game.activePlayer;
    });

    it('constructor', () => {
        expect(game.players.length).to.eq(2);
        expect(game.activePlayer === 0 || game.activePlayer === 1).to.eq(true);
        const amountOfEachLetters = game.config.letters.map((l) => l.amount);
        const totalLetters = amountOfEachLetters.reduce((sum, amount) => sum + amount);
        const totalLettersInEachPlayerEasel = MAX_LETTERS_IN_EASEL;
        const totalAmountOfPlayers = 2;
        expect(game.bag.letters.length).to.eq(totalLetters - totalLettersInEachPlayerEasel * totalAmountOfPlayers);
        expect(game.turnsSkipped).to.eq(0);
    });

    it('place should score according to scorePositions on correct placement', () => {
        const lettersToPlace: Letter[] = ['C', 'O', 'N'];

        // put letters in player easel so placement is possible
        lettersToPlace.forEach((l) => {
            game['getActivePlayer']().easel.push(l);
        });

        expect(() => {
            // place 'con' across in the middle
            game.place(
                lettersToPlace.map((l, i) => new PlacedLetter(l, new Vec2(6 + i, 7))),
                [],
                game.activePlayer,
            );
        }).to.not.throw();

        const thisPlayerScore = game.players[activePlayer].score;
        const positionsOfPlacement = lettersToPlace.map((_l, i) => new Vec2(6 + i, 7));
        const expectedPoints = game.board['scorePositions'](positionsOfPlacement);
        expect(thisPlayerScore).to.eq(expectedPoints);

        // this is no longer this players turn
        expect(game.activePlayer).to.not.eq(activePlayer);
    });

    it('place should score according to scorePositions on correct placement with a blank letter', () => {
        const lettersToPlace: Letter[] = ['C', 'O', 'N'];

        // put letters in player easel so placement is possible
        lettersToPlace.slice(1, 3).forEach((l) => {
            game['getActivePlayer']().easel.push(l);
        });

        game['getActivePlayer']().easel.push(BLANK_LETTER);

        expect(() => {
            // place 'con' across in the middle
            game.place(
                lettersToPlace.map((l, i) => new PlacedLetter(l, new Vec2(6 + i, 7))),
                [0],
                game.activePlayer,
            );
        }).to.not.throw();

        const thisPlayerScore = game.players[activePlayer].score;
        const positionsOfPlacement = lettersToPlace.map((_l, i) => new Vec2(6 + i, 7));
        const expectedPoints = game.board['scorePositions'](positionsOfPlacement);
        expect(thisPlayerScore).to.eq(expectedPoints);

        // this is no longer this players turn
        expect(game.activePlayer).to.not.eq(activePlayer);
    });

    it('place should throw on correct placement as second placement if not connected to other words', () => {
        const lettersToPlace: Letter[] = ['C', 'O', 'N'];
        game.placeCounter = 1;
        // put letters in player easel so placement is possible
        lettersToPlace.forEach((l) => {
            game['getActivePlayer']().easel.push(l);
        });

        expect(() => {
            // place 'con' across in the middle
            game.place(
                lettersToPlace.map((l, i) => new PlacedLetter(l, new Vec2(6 + i, 7))),
                [],
                game.activePlayer,
            );
        }).to.throw();
    });
    // eslint-disable-next-line max-len
    it('place should score according to scorePositions added from the BONUS_POINTS_FOR_FULL_EASEL on correct placement with full easel placement', () => {
        game.players[activePlayer].easel = stringToLetters('abacost');
        const oldEasel = game.players[activePlayer].easel;

        game.place(
            oldEasel.map((l, index) => new PlacedLetter(l, new Vec2(index + 3, 7))),
            [],
            game.activePlayer,
        );

        const thisPlayerScore = game.players[activePlayer].score;
        const positionsOfPlacement = oldEasel.map((_l, i) => new Vec2(3 + i, 7));
        const expectedPoints = game.board['scorePositions'](positionsOfPlacement);
        expect(thisPlayerScore).to.eq(expectedPoints + BONUS_POINTS_FOR_FULL_EASEL);
    });

    // eslint-disable-next-line max-len
    it('place should score according to scorePositions added from the sum of opponent easel points per letter on correct placement on endgame situation', () => {
        game.players[activePlayer].easel = stringToLetters('aa');
        const oldEasel = [...game.players[activePlayer].easel];
        game.bag.letters = [];
        game.place(
            oldEasel.map((letter, index) => new PlacedLetter(letter, new Vec2(index + 6, 7))),
            [],
            game.activePlayer,
        );

        const thisPlayerScore = game.players[activePlayer].score;

        const positionsOfPlacement = oldEasel.map((_l, i) => new Vec2(6 + i, 7));
        const normalScorePosition = game.board['scorePositions'](positionsOfPlacement);

        const othersEasel = game.players[game.activePlayer].easel;
        const pointsArrayOfOtherEasel = othersEasel.map((l) => game.board.pointsPerLetter.get(l) as number);
        const bonusPointsFromOthersEasel = pointsArrayOfOtherEasel.reduce((sum, p) => sum + p);

        const expectedPoints = normalScorePosition + bonusPointsFromOthersEasel;
        expect(thisPlayerScore).to.eq(expectedPoints);
    });

    it('place should throw if initial place is not in the center', () => {
        game.players[activePlayer].easel = stringToLetters('aa');
        const oldEasel = [...game.players[activePlayer].easel];
        expect(() => {
            game.place(
                oldEasel.map((letter, index) => new PlacedLetter(letter, new Vec2(index + 0, 7))),
                [],
                game.activePlayer,
            );
        }).to.throw();
    });

    it('draw should not throw on correct call', () => {
        const ogActivePlayer = game.activePlayer;

        const lettersToDraw = game['getActivePlayer']().easel[0];

        expect(() => game.draw([lettersToDraw], game.activePlayer)).to.not.throw();
        expect(game.activePlayer).to.not.eq(ogActivePlayer);
    });

    it('draw should throw if the length of game bag is lower than MAX_LETTERS_IN_EASEL', () => {
        game.bag.letters = ['A'];
        expect(() => game.draw([game.players[game.activePlayer].easel[0]], game.activePlayer)).to.throw();
    });

    it('skip', () => {
        const oldActivePlayer = game.activePlayer;
        game.skip(game.activePlayer);

        expect(game.activePlayer).to.not.eq(oldActivePlayer);
        expect(game.turnsSkipped).to.eq(1);
    });

    it('gameEnded should be true when one players easel is empty', () => {
        expect(game.needsToEnd()).to.eq(false);

        game.bag.letters = [];
        game.players[0].easel = [];

        expect(game.needsToEnd()).to.eq(true);
    });

    it('needsToEnd should be true when exceeding MAX_TURNS_SKIPPED', () => {
        expect(game.needsToEnd()).to.eq(false);

        game.turnsSkipped = 10;

        expect(game.needsToEnd()).to.eq(true);
    });

    it('needsToEnd should return false if the game is finished', () => {
        game.gameFinished = true;
        expect(game.needsToEnd()).to.eq(false);
    });

    it('endGame should always return the same as getGameEndStatus', () => {
        expect(game.endGame()).to.deep.eq(game['getGameEndStatus']());
    });

    it('getGameEndStatus should return players and the winner as a string from determineWinner', () => {
        const endStatus = game['getGameEndStatus']();
        expect(endStatus.players).to.eq(game.players);
        expect(endStatus.winner).to.eq(game['determineWinner']());
    });

    it('endGameBonus should equal the opponents sum of points in easel', () => {
        const nextPlayerEasel = game['getNextPlayer']().easel;
        const pointsArrayOfNextPlayerOfEasel = nextPlayerEasel.map((l) => game.board.pointsPerLetter.get(l) as number);
        const sumOfPoints = pointsArrayOfNextPlayerOfEasel.reduce((sum, n) => sum + n);

        expect(game['endGameBonus']()).to.eq(sumOfPoints);
    });

    it('endGameScoreAdjustment should equal each players sum of points in easel', () => {
        const playersEasel = game.players.map((p) => p.easel);
        const playersPointsArrayOfEasel = playersEasel.map((easel) => easel.map((l) => game.board.pointsPerLetter.get(l) as number));
        const pointsSums = playersPointsArrayOfEasel.map((pointsArray) => pointsArray.reduce((sum, n) => sum + n));

        game['endGameScoreAdjustment']();
        game.players.forEach((player, index) => expect(player.score).to.eq(-pointsSums[index]));
    });

    it('determineWinner should return null if both players have the same amount of points', () => {
        expect(game['determineWinner']()).to.eq(null);
    });

    it('determineWinner should return highest scoring players name', () => {
        game.players[0].score++;
        expect(game['determineWinner']()).to.eq('player 1');
        game.players[1].score += 2;
        expect(game['determineWinner']()).to.eq('player 2');
    });

    it('checkMove should throw when it is not this players turn', () => {
        expect(() => game['checkMove']([], game['nextPlayer']())).to.throw();
    });

    it('checkMove should throw when asked letters are not in players easel', () => {
        expect(() => game['checkMove'](['Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z'], game.activePlayer)).to.throw();
    });

    it('checkMove should not throw on correct call', () => {
        const activePlayerEasel = game['getActivePlayer']().easel;
        const firstLetterOfEasel = activePlayerEasel[0];
        expect(() => game['checkMove']([firstLetterOfEasel], game.activePlayer)).to.not.throw();
    });

    it('nextTurn should put next player in activePlayer field', () => {
        const nextPlayer = game['nextPlayer']();
        game['nextTurn']();
        expect(game.activePlayer).to.eq(nextPlayer);
    });

    it('nextPlayer should return the next players number', () => {
        const expectedResult = (game.activePlayer + 1) % game.players.length;
        expect(game['nextPlayer']()).to.eq(expectedResult);
    });

    it('getNextPlayer', () => {
        const nextPlayerNumber = game['nextPlayer']();
        expect(game['getNextPlayer']()).to.eq(game.players[nextPlayerNumber]);
    });

    it('getActivePlayer', () => {
        expect(game['getActivePlayer']()).to.eq(game.players[game.activePlayer]);
    });
});
