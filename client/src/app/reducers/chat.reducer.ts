import * as chatActions from '@app/actions/chat.actions';
import { resetRoomState } from '@app/actions/room.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { createReducer, on } from '@ngrx/store';

export const chatFeatureKey = 'chat';

export const initialState: ChatMessage[] = [];

export const reducer = createReducer(
    initialState,
    on(chatActions.receivedMessage, (state, { username, message, messageType }) => [...state, { username, message, messageType }]),
    on(chatActions.restoreMessages, (state, { oldMessages }) => oldMessages),
    on(resetRoomState, () => initialState),
);
