import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { clearSelection } from '@app/actions/board.actions';
import * as chatActions from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    @ViewChild('chatMessage', { static: true }) private chatMessage: ElementRef<HTMLInputElement>;
    chat$: Observable<ChatMessage[]>;
    username: string;
    gameEnded: boolean;
    constructor(
        private store: Store<{ chat: ChatMessage[]; gameStatus: GameStatus }>,
        private playerStore: Store<{ players: Players }>,
        private eRef: ElementRef,
    ) {
        this.chat$ = store.select('chat');
        this.playerStore.subscribe((us) => (this.username = us.players.player.name));
    }

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (this.eRef.nativeElement.contains(event.target)) this.store.dispatch(clearSelection());
    }

    ngOnInit(): void {
        this.store.dispatch(chatActions.initiateChatting());
        this.chatMessage.nativeElement.focus();
        this.store.select('gameStatus').subscribe((gameStatus) => {
            this.gameEnded = gameStatus.gameEnded;
            if (gameStatus.gameEnded) this.chatMessage.nativeElement.focus();
        });
    }

    submitMessage(): void {
        this.store.dispatch(chatActions.messageWritten({ username: this.username, message: this.chatMessage.nativeElement.value }));
        this.chatMessage.nativeElement.value = '';
    }

    chatBoxBlur(): void {
        if (this.gameEnded) this.chatMessage.nativeElement.focus();
    }
}
