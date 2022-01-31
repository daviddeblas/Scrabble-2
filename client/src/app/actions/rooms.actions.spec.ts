import * as fromRooms from './room.actions';

describe('loadRoomss', () => {
    it('should return an action', () => {
        expect(fromRooms.loadRooms().type).toBe('[Rooms] Load Rooms');
    });
});
