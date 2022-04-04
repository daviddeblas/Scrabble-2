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

    it('createHistoryInformation should return correct value given', () => {
        let mockDate = new Date();
        let mockDateToString = mockDate.toLocaleString('fr-CA');
        const gameHistory = new GameHistoryHandler();
        const historyData = gameHistory.createGameHistoryData([player1, player2], false, GameMode.Classical);
        expect(historyData.date).to.eq(mockDateToString);
        expect(historyData.gameDuration).to.eq('0 sec');
        expect(historyData.namePlayer1).to.eq('Jean');
        expect(historyData.scorePlayer1).to.eq(0);
        expect(historyData.namePlayer2).to.eq('Christophe');
        expect(historyData.scorePlayer2).to.eq(0);
        expect(historyData.gameMode).to.eq('Classique');

        expect(historyData.isSurrender).to.eq(false);
    });

    it('createHistoryInformation should return given value when gameMode Log and game surrendered', () => {
        const gameHistory = new GameHistoryHandler();
        const historyData = gameHistory.createGameHistoryData([player1, player2], true, GameMode.Log2990);
        expect(historyData.gameMode).to.eq('Log2990');
        expect(historyData.isSurrender).to.eq(true);
    });
});
