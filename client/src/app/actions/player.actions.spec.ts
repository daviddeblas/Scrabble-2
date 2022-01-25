import * as fromPlayer from './player.actions';

describe('loadPlayers', () => {
  it('should return an action', () => {
    expect(fromPlayer.loadPlayers().type).toBe('[Player] Load Players');
  });
});
