import * as roomActions from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { createReducer, on } from '@ngrx/store';

export const roomsFeatureKey = 'room';

export interface RoomState {
    roomInfo?: RoomInfo;
    roomList?: RoomInfo[];
    pendingRoom?: RoomInfo;
}

export const initialState: RoomState = {};

export const reducer = createReducer(
    initialState,
    on(roomActions.createRoomSuccess, (state, { roomInfo }) => ({ ...state, roomInfo })),
    on(roomActions.loadRoomsSuccess, (state, { rooms }) => ({ ...state, roomList: rooms })),
    on(roomActions.joinRoom, (state, { roomInfo }) => ({ ...state, pendingRoom: roomInfo })),
    on(roomActions.joinRoomDeclined, (state) => ({ ...state, pendingRoom: undefined })),
);
