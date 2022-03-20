/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initiateChatting, messageWritten } from '@app/actions/chat.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { EffectsRootModule } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { ChatBoxComponent } from './chat-box.component';

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    let store: MockStore;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatBoxComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule, EffectsRootModule],
            providers: [
                provideMockStore(),
                {
                    provide: EffectsRootModule,
                    useValue: {
                        addEffects: jasmine.createSpy('addEffects'),
                    },
                },
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatBoxComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch "[Chat] Initiate Chatting" when created', () => {
        const expectedAction = cold('a', { a: initiateChatting() });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should dispatch "[Chat] Message written" when submitted', () => {
        const expectedUsername = 'My username';
        const expectedMessage = 'My Message';
        component['chatMessage'].nativeElement.value = expectedMessage;
        component.username = expectedUsername;
        fixture.detectChanges();

        component.submitMessage();
        const expectedAction = cold('a', { a: messageWritten({ username: expectedUsername, message: expectedMessage }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should not dispatch "[Chat] Message written" when submitted with no message', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        const expectedUsername = 'My username';
        const expectedMessage = '';
        component['chatMessage'].nativeElement.value = expectedMessage;
        component.username = expectedUsername;
        fixture.detectChanges();

        component.submitMessage();
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should reset the chatMessage value when submitted', () => {
        component['chatMessage'].nativeElement.value = 'My message';
        fixture.detectChanges();
        component.submitMessage();
        expect(component['chatMessage'].nativeElement.value).toEqual('');
    });

    it('should always focus the input if game ended', () => {
        const focusSpy = spyOn(component['chatMessage'].nativeElement, 'focus');
        component.gameEnded = true;
        component.chatBoxBlur();
        expect(focusSpy).toHaveBeenCalled();
    });

    it('should not focus the input if game is not ended', () => {
        const focusSpy = spyOn(component['chatMessage'].nativeElement, 'focus');
        component.gameEnded = false;
        component.chatBoxBlur();
        expect(focusSpy).not.toHaveBeenCalled();
    });

    it('should send the dispatch message written with place command found by hint', () => {
        const expectedMessage = '!placer h7h mordre';
        component.gameEnded = false;
        component.sendHintMessage(expectedMessage);
        const expectedAction = cold('a', { a: messageWritten({ username: component.username, message: expectedMessage }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should not dispatch message written if the message does not start by !placer', () => {
        const dispatchSpy = spyOn(component['store'], 'dispatch');
        const expectedMessage = '!passer';
        component.gameEnded = false;
        component.sendHintMessage(expectedMessage);
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch message written if game has ended', () => {
        const dispatchSpy = spyOn(component['store'], 'dispatch');
        const expectedMessage = '!placer h7h mordre';
        component.gameEnded = true;
        component.sendHintMessage(expectedMessage);
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('ngOnInit should focus input if gameEnded changes', () => {
        const focusSpy = spyOn(component['chatMessage'].nativeElement, 'focus');
        store.overrideSelector('gameStatus', { gameEnded: true });
        component.ngOnInit();
        expect(focusSpy).toHaveBeenCalled();
    });

    it('should call detectChanges() when ngAfterViewChecked is called', () => {
        const spy = spyOn(component['changeDetector'], 'detectChanges');
        component.ngAfterViewChecked();
        expect(spy).toHaveBeenCalled();
    });
});
