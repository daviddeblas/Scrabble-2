import { resetAllState } from '@app/actions/game-status.actions';
import * as roomActions from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { createReducer, on } from '@ngrx/store';

export const roomsFeatureKey = 'room';

export interface RoomState {
    // For Hosting
    roomInfo?: RoomInfo;
    pendingPlayer?: string;

    // For Joining
    roomList: RoomInfo[];
    pendingRoom?: RoomInfo;
}

export const initialState: RoomState = {
    roomList: [],
};

export const reducer = createReducer(
    initialState,
    on(resetAllState, () => initialState),
    // For hosting
    on(roomActions.createRoomSuccess, (state, { roomInfo }) => ({ ...state, roomInfo })),
    on(roomActions.closeRoom, () => initialState),
    on(roomActions.joinInviteReceived, (state, { playerName }) => ({ ...state, pendingPlayer: playerName })),
    on(roomActions.refuseInvite, (state) => ({ ...state, pendingPlayer: undefined })),
    on(roomActions.joinInviteCanceled, (state) => ({ ...state, pendingPlayer: undefined })),

    // For joining
    on(roomActions.loadRoomsSuccess, (state, { rooms }) => ({ ...state, roomList: rooms })),
    on(roomActions.joinRoom, (state, { roomInfo }) => ({ ...state, pendingRoom: roomInfo })),
    on(roomActions.cancelJoinRoom, (state) => ({ ...state, pendingRoom: undefined })),
    on(roomActions.joinRoomDeclined, (state) => ({ ...state, pendingRoom: undefined })),
);
