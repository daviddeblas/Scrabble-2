/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { messageWritten } from '@app/actions/chat.actions';
import { ChatService } from '@app/services/chat.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class ChatEffects {
    messageWrittenEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(messageWritten),
                tap((action) => {
                    console.log('Je suis arrivé');
                    this.chatService.messageWritten(action.username, action.message);
                }),
            ),
        { dispatch: false },
    );

    constructor(private actions$: Actions, private chatService: ChatService) {}
}
