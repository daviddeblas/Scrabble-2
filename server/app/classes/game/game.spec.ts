/* eslint-disable dot-notation */
import { GameConfigService } from '@app/services/game-config.service';
import { expect } from 'chai';
import Container from 'typedi';
import { Letter, stringToLetters } from '@app/classes/letter';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';
import { BONUS_POINTS_FOR_FULL_EASEL, Game, MAX_LETTERS_IN_EASEL } from './game';

describe('game', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game(Container.get(GameConfigService).configs.configs[0], ['player 1', 'player 2']);
    });

    it('constructor', () => {
        expect(game.players.length).to.eq(2);
        expect(game.activePlayer === 0 || game.activePlayer === 1).to.eq(true);
        expect(game.bag.letters.length).to.eq(game.config.letters.map((l) => l.amt).reduce((sum, amt) => sum + amt) - MAX_LETTERS_IN_EASEL * 2);
        expect(game.turnsSkipped).to.eq(0);
    });

    it('place', () => {
        const activePlayer = game.activePlayer;
        const lettersToPlace = ['C' as Letter, 'O' as Letter, 'N' as Letter];
        lettersToPlace.forEach((l) => {
            game.players[game.activePlayer].easel.push(l);
        });
        expect(() => {
            game.place(
                lettersToPlace.map((l, i) => new PlacedLetter(l, new Vec2(6 + i, 7))),
                game.activePlayer,
            );
        }).to.not.throw();
        expect(game.activePlayer).to.not.eq(activePlayer);
        expect(game.players[activePlayer].score).to.eq(game.board['scorePositions'](lettersToPlace.map((_l, i) => new Vec2(6 + i, 7))));
    });

    it('place with bonus', () => {
        const activePlayer = game.activePlayer;
        game.players[activePlayer].easel = stringToLetters('abacost');
        const oldEasel = game.players[activePlayer].easel;
        game.place(
            oldEasel.map((l, index) => new PlacedLetter(l, new Vec2(index + 3, 7))),
            game.activePlayer,
        );
        expect(game.players[activePlayer].score).to.eq(
            game.board['scorePositions'](oldEasel.map((_l, i) => new Vec2(3 + i, 7))) + BONUS_POINTS_FOR_FULL_EASEL,
        );
    });

    it('place with endGame bonus', () => {
        const activePlayer = game.activePlayer;
        game.players[activePlayer].easel = stringToLetters('aa');
        const oldEasel = [...game.players[activePlayer].easel];
        game.bag.letters = [];
        game.place(
            oldEasel.map((l, index) => new PlacedLetter(l, new Vec2(index + 6, 7))),
            game.activePlayer,
        );
        expect(game.players[activePlayer].score).to.eq(
            game.players[game.activePlayer].easel.map((l) => game.board.pointsPerLetter.get(l) as number).reduce((s, p) => s + p) +
                oldEasel.map((l) => game.board.pointsPerLetter.get(l) as number).reduce((s, p) => s + p),
        );
    });

    it('draw', () => {
        const ogActivePlayer = game.activePlayer;
        expect(() => game.draw([game.players[game.activePlayer].easel[0]], game.activePlayer)).to.not.throw();
        expect(game.activePlayer).to.not.eq(ogActivePlayer);
        game.bag.letters = ['A'];
        expect(() => game.draw([game.players[game.activePlayer].easel[0]], game.activePlayer)).to.throw();
    });

    it('skip', () => {
        const oldActivePlayer = game.activePlayer;
        game.skip(game.activePlayer);
        expect(game.activePlayer).to.not.eq(oldActivePlayer);
        expect(game.turnsSkipped).to.eq(1);
    });

    it('gameEnded', () => {
        expect(game.gameEnded()).to.eq(false);
        game.bag.letters = [];
        game.players[0].easel = [];
        expect(game.gameEnded()).to.eq(true);
        game.turnsSkipped = 10;
        expect(game.gameEnded()).to.eq(true);
    });

    it('endGame', () => {
        expect(game.endGame()).to.deep.eq(game['getGameEndStatus']());
    });

    it('getGameEndStatus', () => {
        const endStatus = game['getGameEndStatus']();
        expect(endStatus.players).to.eq(game.players);
        expect(endStatus.winner).to.eq(game['determineWinner']());
    });

    it('endGameBonus', () => {
        expect(game['endGameBonus']()).to.eq(
            game['getNextPlayer']()
                .easel.map((l) => game.board.pointsPerLetter.get(l) as number)
                .reduce((s, n) => s + n),
        );
    });

    it('endGameScoreAdjustment', () => {
        game['endGameScoreAdjustment']();
        expect(game.players[0].score).to.eq(-game.players[0].easel.map((l) => game.board.pointsPerLetter.get(l) as number).reduce((s, n) => s + n));
        expect(game.players[1].score).to.eq(-game.players[1].easel.map((l) => game.board.pointsPerLetter.get(l) as number).reduce((s, n) => s + n));
    });

    it('determineWinner', () => {
        expect(game['determineWinner']()).to.eq('');
        game.players[0].score++;
        expect(game['determineWinner']()).to.eq('player 1');
        game.players[1].score += 2;
        expect(game['determineWinner']()).to.eq('player 2');
    });

    it('checkMove', () => {
        expect(() => game['checkMove']([], game['nextPlayer']())).to.throw();
        expect(() => game['checkMove'](['Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z'], game.activePlayer)).to.throw();
        expect(() => game['checkMove']([game['getActivePlayer']().easel[0]], game.activePlayer)).to.not.throw();
    });

    it('nextTurn', () => {
        const nextPlayer = game['nextPlayer']();
        game['nextTurn']();
        expect(game.activePlayer).to.eq(nextPlayer);
    });

    it('nextPlayer', () => {
        expect(game['nextPlayer']()).to.eq((game.activePlayer + 1) % game.players.length);
    });

    it('getNextPlayer', () => {
        expect(game['getNextPlayer']()).to.eq(game.players[game['nextPlayer']()]);
    });

    it('getActivePlayer', () => {
        expect(game['getActivePlayer']()).to.eq(game.players[game.activePlayer]);
    });
});
