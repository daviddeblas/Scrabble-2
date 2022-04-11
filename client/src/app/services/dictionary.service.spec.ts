import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { loadDictionariesSuccess } from '@app/actions/dictionaries.actions';
import { SocketTestHelper } from '@app/helper/socket-test-helper';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { iDictionary } from 'common/interfaces/dictionary';
import { cold } from 'jasmine-marbles';
import { DictionaryService } from './dictionary.service';
import { SocketClientService } from './socket-client.service';

describe('DictionaryService', () => {
    let service: DictionaryService;
    let socketService: SocketTestHelper;
    let store: MockStore;

    beforeEach(() => {
        socketService = new SocketTestHelper();

        TestBed.configureTestingModule({
            providers: [
                provideMockStore(),
                {
                    provide: HttpClient,
                    useValue: {
                        get: () => {
                            return;
                        },
                        post: () => {
                            return;
                        },
                    },
                },
                {
                    provide: SocketClientService,
                    useValue: {
                        socket: socketService,
                        send: (value: string) => {
                            socketService.emit(value);
                            return;
                        },
                        on: (event: string, callback: () => void) => {
                            socketService.on(event, callback);
                            return;
                        },
                    },
                },
            ],
        });
        service = TestBed.inject(DictionaryService);
        store = TestBed.inject(MockStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getDictionaries should send "get dictionaries" to socket', () => {
        const spyOnGetDictionaries = spyOn(socketService, 'emit');
        service.getDictionaries();

        expect(spyOnGetDictionaries).toHaveBeenCalledWith('get dictionaries');
    });

    it('getDictionaries should wait for "receive dictionaries" from socket and dispatch "loadDictionariesSuccess"', () => {
        service.getDictionaries();

        const dictionaries: iDictionary[] = [{ title: 'dict', description: 'desc' }];
        const expectedAction = cold('a', { a: loadDictionariesSuccess({ dictionaries }) });

        socketService.peerSideEmit('receive dictionaries', dictionaries);
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });
});
