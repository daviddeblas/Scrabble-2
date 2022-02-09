import { TestBed } from '@angular/core/testing';
import * as chatActions from '@app/actions/chat.actions';
import { ChatService } from '@app/services/chat.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { ChatEffects } from './chat.effects';

describe('ChatEffects', () => {
    let actions$: Observable<unknown>;
    let effects: ChatEffects;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let service: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ChatEffects,
                provideMockActions(() => actions$),
                {
                    provide: ChatService,
                    useValue: jasmine.createSpyObj('ChatService', ['acceptNewMessages', 'messageWritten']),
                },
            ],
        });
        effects = TestBed.inject(ChatEffects);
        service = TestBed.inject(ChatService);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    it('initiateChattingEffect$ should call the function acceptNewMessages from chat service', (done) => {
        actions$ = of({ type: '[Chat] Initiate chatting' });
        effects.initiateChattingEffect$.subscribe();
        expect(service.acceptNewMessages).toHaveBeenCalledWith();
        done();
    });

    it('should call the function messageWritten from chat service', (done) => {
        actions$ = of(chatActions.messageWritten({ username: 'Test1', message: 'Test2' }));
        effects.messageWrittenEffect$.subscribe();
        expect(service.messageWritten).toHaveBeenCalledWith('Test1', 'Test2');
        done();
    });
});
