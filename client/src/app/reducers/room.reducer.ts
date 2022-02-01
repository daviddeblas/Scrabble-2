import * as roomActions from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { createReducer, on } from '@ngrx/store';

export const roomsFeatureKey = 'room';

export interface RoomState {
    // For Hosting
    roomInfo?: RoomInfo;
    pendingPlayer?: string;

    // For Joining
    roomList?: RoomInfo[];
    pendingRoom?: RoomInfo;
}

export const initialState: RoomState = {};

export const reducer = createReducer(
    initialState,
    // For hosting
    on(roomActions.createRoomSuccess, (state, { roomInfo }) => ({ ...state, roomInfo })),
    on(roomActions.closeRoom, () => ({})),
    on(roomActions.joinInviteReceived, (state, { playerName }) => ({ ...state, pendingPlayer: playerName })),
    on(roomActions.refuseInvite, (state) => ({ ...state, pendingPlayer: undefined })),

    // For joining
    on(roomActions.loadRoomsSuccess, (state, { rooms }) => ({ ...state, roomList: rooms })),
    on(roomActions.joinRoom, (state, { roomInfo }) => ({ ...state, pendingRoom: roomInfo })),
    on(roomActions.joinRoomDeclined, (state) => ({ ...state, pendingRoom: undefined })),
);
