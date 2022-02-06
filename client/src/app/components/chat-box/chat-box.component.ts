import { Component, ElementRef, ViewChild } from '@angular/core';
import * as chatActions from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
    @ViewChild('chatMessage') chatMessage: ElementRef<HTMLInputElement>;
    chat$: Observable<ChatMessage[]>;
    username: string;
    constructor(private store: Store<{ chat: ChatMessage[] }>) {
        this.chat$ = store.select('chat');
        this.username = 'Raph';
    }

    submitMessage(): void {
        this.store.dispatch(chatActions.messageWritten({ username: this.username, message: this.chatMessage.nativeElement.value }));
        this.chatMessage.nativeElement.value = '';
    }
}
