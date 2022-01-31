import { createAction, props } from '@ngrx/store';

export const sendMsg = createAction('[Chat] Send msg', props<{ username: string; message: string }>());
