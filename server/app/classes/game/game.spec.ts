/* eslint-disable dot-notation */
import { GameConfigService } from '@app/services/game-config.service';
import { expect } from 'chai';
import Container from 'typedi';
import { Letter } from '../letter';
import { PlacedLetter } from '../placed-letter';
import { Vec2 } from '../vec2';
import { Game, MAX_LETTERS_IN_EASEL } from './game';

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
        game.players[game.activePlayer].easel.push('C' as Letter, 'O' as Letter, 'N' as Letter);
        expect(() => {
            game.place(
                [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))],
                game.activePlayer,
            );
        }).to.not.throw();
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
