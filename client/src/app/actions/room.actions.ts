import { GameOptions } from '@app/classes/game-options';
import { RoomInfo } from '@app/classes/room-info';
import { createAction, props } from '@ngrx/store';

export const createRoom = createAction('[Room] Create Rooms', props<{ gameOptions: GameOptions }>());
export const createRoomSuccess = createAction('[Room] Create Rooms Success', props<{ roomInfo: RoomInfo }>());
export const createRoomFailed = createAction('[Room] Create Rooms Failed', props<{ error: Error }>());

export const loadRooms = createAction('[Room] Load Rooms');
export const loadRoomsSuccess = createAction('[Room] Load Rooms Success', props<{ rooms: RoomInfo[] }>());
export const loadRoomsFailed = createAction('[Room] Load Rooms Failed', props<{ error: Error }>());

export const joinRoom = createAction('[Room] Join Room', props<{ playerName: string; roomId: string }>());
export const joinRoomAccepted = createAction('[Room] Join Room Accepted', props<{ playerName: string; roomId: string }>());
export const joinRoomDeclined = createAction('[Room] Join Room Declined', props<{ playerName: string; roomId: string }>());
