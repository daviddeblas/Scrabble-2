import * as chatActions from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { createReducer, on } from '@ngrx/store';

export const chatFeatureKey = 'chat';

export const initialState: ChatMessage[] = [];

export const reducer = createReducer(
    initialState,
    on(chatActions.sendMsg, (state, { username, message }) => [...state, { username, message }]),
);
