import { Component, OnInit } from '@angular/core';
import * as chatActions from '@app/actions/chat.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    constructor(private store: Store) {}

    ngOnInit() {
        for (let i = 0; i < 100; ++i) {
            this.store.dispatch(chatActions.sendMsg({ username: 'Raph', message: 'msg #' + i }));
        }
    }
}
