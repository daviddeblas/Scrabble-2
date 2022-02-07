import { TestBed } from '@angular/core/testing';
import * as chatActions from '@app/actions/chat.actions';
import { ChatService } from '@app/services/chat.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { ChatEffects } from './chat.effects';
describe('RoomEffects', () => {
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
                    useValue: jasmine.createSpyObj('ChatService', ['info']),
                },
            ],
        });
        effects = TestBed.inject(ChatEffects);
        service = TestBed.inject(ChatService);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    it('should call the function messageWriten from chat service', () => {
        actions$ = cold('a', { a: chatActions.messageWritten({ username: 'Test1', message: 'Test2' }) });
        effects.messageWrittenEffect$.subscribe(() => {
            try {
                expect(service.info).toHaveBeenCalledWith({ username: 'Test1', message: 'Test2' });
            } catch (error) {
                fail('messageWrittenEffect$: ' + error);
            }
        });
    });
});
