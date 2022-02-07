import { createAction, props } from '@ngrx/store';

// export const sendMsg = createAction('[Chat] Send msg', props<{ username: string; message: string }>());

export const initiateChatting = createAction('[Chat] Initiate chatting');

export const messageWritten = createAction('[Chat] Message written', props<{ username: string; message: string }>());

export const chatMessageReceived = createAction('[Chat] Received message', props<{ username: string; message: string }>());

export function acceptNewMessages() {
    throw new Error('Function not implemented.');
}
