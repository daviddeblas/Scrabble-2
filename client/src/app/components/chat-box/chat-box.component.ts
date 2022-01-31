import { Component } from '@angular/core';
import { ChatMessage } from '@app/classes/chat-message';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
    chat$: Observable<ChatMessage[]>;

    constructor(store: Store<{ chat: ChatMessage[] }>) {
        this.chat$ = store.select('chat');
    }
}
