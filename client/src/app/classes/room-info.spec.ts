import { GameOptions } from './game-options';
import { RoomInfo } from './room-info';

describe('RoomInfo', () => {
    it('should create an instance', () => {
        const timer = 60;
        const gameOptions = new GameOptions('Host 1', 'Mon Dictionaire', timer);
        const room = new RoomInfo('Room id', gameOptions);
        expect(room.gameOptions.hostname).toEqual('Host 1');
        expect(room.roomId).toEqual('Room id');
        expect(room.gameOptions).toEqual(gameOptions);
    });
});
