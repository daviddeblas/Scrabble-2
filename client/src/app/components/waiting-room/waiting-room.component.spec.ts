import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameOptions } from '@app/classes/game-options';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';
import { WaitingRoomComponent } from './waiting-room.component';

class SocketClientServiceMock extends SocketClientService {
    public connected = false;
    override connect() {
        this.connected = true;  // Permet de ne pas se reconnecter
    }
    override isSocketAlive() {
        return this.connected;
    }
}


describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    const mockDialogSpy: { close: jasmine.Spy } = {
        close: jasmine.createSpy('close'),
    };
    //let service: SocketClientService;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper()
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule, FormsModule],
            providers: 
            [
                FormBuilder,
                {
                    provide: CdkStepper,
                },
                {
                    provide: MatDialogRef,
                    useValue: mockDialogSpy,
                },
                { 
                    provide: SocketClientService, 
                    useValue: socketServiceMock, 
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the window when the begin button is clicked', () => {
        component.closeDialog();
        expect(mockDialogSpy.close).toHaveBeenCalled();
    });

    it('should send an accept event', () => {
        const spy = spyOn(component.socketService, "send");
        const eventName = "accept";
        component.closeDialog();
        expect(spy).toHaveBeenCalledWith(eventName);
    });

    it('The démarrer button should be disabled when player 2 is coming', () => {
        component.player2 = 'Johnson';
        fixture.detectChanges();
        const beginButton = document.getElementsByTagName('button')[1];
        expect(beginButton.disabled).toBeFalse();
    });

    it('should hide the waiting-section if the player 2 is here', () => {
        component.player2 = 'Johnson';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#waiting-section'))).toBeNull();
    });

    describe('Receiving events', () => {

        it('should handle gameSettings event with the three settings from the server', () => {
            let gameSettings = new GameOptions();
            gameSettings =   {hostname: "Jack",dictionaryType: "Français", timePerRound: 60}
            socketHelper.peerSideEmit("game settings", gameSettings);
            expect(component.player1).toBe(gameSettings.hostname);
            expect(component.timer).toBe(gameSettings.timePerRound);
            expect(component.dictionary).toBe(gameSettings.dictionaryType);
        });

        it('should handle player joining event with a name for the player 2', () => {
            const name = "Leonardo";
            socketHelper.peerSideEmit("player joining", name);
            expect(component.player2).toBe(name);
        });
    })

    it('should send the event refuse to the server and reset player2', () => {
        const spy = spyOn(component.socketService, "send");
        const eventName = "refuse";
        const testString = 'Leonardo';
        component.player2 = testString;
        component.rejectInvite();
        expect(spy).toHaveBeenCalledWith(eventName);
        expect(component.player2).toEqual('');
    });

    it('should called quitWaitingRoom if there is a player 2', () => {
        component.stepper = {reset(){} } as MatStepper;
        component.player2 = 'AlexTerrieur';
        component.quitWaitingRoom();
        expect(component.player2).toEqual('');
    });

    it('should only call the stepper.reset if player 2 is undefined', () => {
        component.stepper = {reset(){} } as MatStepper;
        component.quitWaitingRoom();
        expect(component.player2).toBeUndefined();
    });

    it('should not be able to reconnect after the initialization', () => {
        const spy = spyOn(socketServiceMock, "connect");
        component.connect();
        expect(spy).toHaveBeenCalledTimes(0);
    });
    
});
