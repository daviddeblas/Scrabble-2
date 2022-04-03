/* eslint-disable prefer-const */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-invalid-this */
import { GameHistoryHandler } from '@app/classes/game-history-handler';
import { Player } from '@app/classes/game/player';
import { expect } from 'chai';
import { GameMode } from 'common/interfaces/game-mode';

describe('GameHistoryHandler', () => {
    const player1: Player = new Player('Jean');
    const player2: Player = new Player('Christophe');

    it('createHistoryInformation', () => {
        let mockDate = new Date();
        let mockDateToString = mockDate.toLocaleString();
        const gameHistory = new GameHistoryHandler();
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).date).to.eq(mockDateToString);
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).gameDuration).to.eq('0 sec');
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).namePlayer1).to.eq('Jean');
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).scorePlayer1).to.eq(0);
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).namePlayer2).to.eq('Christophe');
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).scorePlayer2).to.eq(0);
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).gameMode).to.eq('Classique');
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Log2990).gameMode).to.eq('Log2990');
        expect(gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical).isSurrender).to.eq(false);
        expect(gameHistory.createGameHistoryData([player1, player2], true, GameMode.Classical).isSurrender).to.eq(true);
    });
});
