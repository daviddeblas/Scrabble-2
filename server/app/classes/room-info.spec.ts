import { expect } from 'chai';
import { RoomInfo } from './room-info';

describe('RoomInfo', () => {
    it('should create an instance', () => {
        const room = new RoomInfo('Host 1', 'Room id');
        expect(room.host).to.eq('Host 1');
        expect(room.roomId).to.eq('Room id');
    });
});
