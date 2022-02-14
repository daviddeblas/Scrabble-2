import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as chatActions from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    @ViewChild('chatMessage', { static: true }) chatMessage: ElementRef<HTMLInputElement>;
    chat$: Observable<ChatMessage[]>;
    username: string;
    constructor(private store: Store<{ chat: ChatMessage[] }>, private playerStore: Store<{ players: Players }>) {
        this.chat$ = store.select('chat');
        this.playerStore.subscribe((us) => (this.username = us.players.player.name));
    }
    ngOnInit(): void {
        this.store.dispatch(chatActions.initiateChatting());
        this.chatMessage.nativeElement.focus();
    }

    submitMessage(): void {
        this.store.dispatch(chatActions.messageWritten({ username: this.username, message: this.chatMessage.nativeElement.value }));
        this.chatMessage.nativeElement.value = '';
    }
}
