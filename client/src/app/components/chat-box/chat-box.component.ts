import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    chat$: Observable<string[]>;

    constructor(store: Store<{ chat: string[] }>) {
        this.chat$ = store.select('chat');
    }

    ngOnInit(): void {}
}
