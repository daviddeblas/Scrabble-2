/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initiateChatting, messageWritten } from '@app/actions/chat.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { KeyManagerService } from '@app/services/key-manager.service';
import { EffectsRootModule } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { ChatBoxComponent } from './chat-box.component';

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    let store: MockStore;
    let keyManagerMock: jasmine.SpyObj<KeyManagerService>;

    beforeEach(async () => {
        keyManagerMock = jasmine.createSpyObj('keyManager', ['onEsc']);
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
                { provide: KeyManagerService, useValue: keyManagerMock },
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

    it('ngOnInit should focus input if gameEnded changes', () => {
        const focusSpy = spyOn(component['chatMessage'].nativeElement, 'focus');
        store.overrideSelector('gameStatus', { gameEnded: true });
        component.ngOnInit();
        expect(focusSpy).toHaveBeenCalled();
    });

    it('should call onEsc if the click target is inside the chatBox', () => {
        const e: Event = { target: component['eRef'].nativeElement } as Event;
        component.clickout(e);
        expect(keyManagerMock.onEsc).toHaveBeenCalled();
    });

    it('should not call onEsc if the click target is outside the chatBox', () => {
        const e: Event = { target: document.parentElement } as Event;
        component.clickout(e);
        expect(keyManagerMock.onEsc).not.toHaveBeenCalled();
    });
});
