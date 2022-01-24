import * as chatActions from '@app/actions/chat.actions';
import { createReducer, on } from '@ngrx/store';

export const chatFeatureKey = 'chat';

export const initialState: string[] = [];

export const reducer = createReducer(
    initialState,
    on(chatActions.sendMsg, (state, { username, msg }) => [...state, username + ': ' + msg]),
);
