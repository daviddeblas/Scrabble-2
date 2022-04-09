import { Injectable } from '@angular/core';
import { loadDictionariesSuccess } from '@app/actions/dictionaries.actions';
import { Store } from '@ngrx/store';
import { iDictionary } from 'common/interfaces/dictionary';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    constructor(private socketService: SocketClientService, private store: Store) {}

    getDictionaries(): void {
        this.socketService.send('get dictionaries');

        this.socketService.on('receive dictionaries', (dictionaries: iDictionary[]) => {
            this.store.dispatch(loadDictionariesSuccess({ dictionaries }));
        });
    }
}
