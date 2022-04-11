import { Injectable } from '@angular/core';
import { loadBotNamesSuccess } from '@app/actions/bot-names.actions';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class BotNamesService {
    constructor(private socketService: SocketClientService, private store: Store) {}

    getBotNames() {
        this.socketService.send('get bot names');
        this.socketService.on('receive bot name', (arr: { easyBots: string[]; hardBots: string[] }) => {
            this.store.dispatch(loadBotNamesSuccess({ names: arr }));
        });
    }
}
