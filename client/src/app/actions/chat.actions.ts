import { createAction, props } from '@ngrx/store';

export const initiateChatting = createAction('[Chat] Initiate chatting');

export const messageWritten = createAction('[Chat] Message written', props<{ username: string; message: string }>());

export const receivedMessage = createAction('[Chat] Received message', props<{ username: string; message: string }>());

export const acceptNewMessages = () => {
    throw new Error('Function not implemented.');
};
