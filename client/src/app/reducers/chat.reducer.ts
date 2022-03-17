import * as chatActions from '@app/actions/chat.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { ChatMessage } from '@app/interfaces/chat-message';
import { createReducer, on } from '@ngrx/store';

export const chatFeatureKey = 'chat';

export const initialState: ChatMessage[] = [];

export const reducer = createReducer(
    initialState,
    on(chatActions.receivedMessage, (state, { username, message, messageType }) => {
        const messages = [...state];
        const newMessages = message.split('\n').map((msg) => ({ username, message: msg, messageType }));
        messages.push(...newMessages);
        return messages;
    }),
    on(chatActions.restoreMessages, (state, { oldMessages }) => oldMessages),
    on(resetAllState, () => initialState),
);
