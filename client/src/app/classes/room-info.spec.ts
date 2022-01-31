import { RoomInfo } from './room-info';

describe('RoomInfo', () => {
    it('should create an instance', () => {
        expect(new RoomInfo('Host 1', 'Room id')).toBeTruthy();
    });
});
