import * as fromGameStatus from './game-status.actions';

describe('[Game Status] Actions', () => {
    it('should return an action', () => {
        expect(fromGameStatus.startNewRound({ activePlayer: 'Player 1' }).type).toBe('[Game Status] Start New Round');
    });
});
