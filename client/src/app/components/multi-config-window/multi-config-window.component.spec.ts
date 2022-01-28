import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';
import { MultiConfigWindowComponent } from './multi-config-window.component';

class SocketClientServiceMock extends SocketClientService {
    connected = false;
    override connect() {
        this.connected = true; // Permet de ne pas se reconnecter
    }
    override isSocketAlive() {
        return this.connected;
    }
}

describe('MultiConfigWindowComponent', () => {
    let component: MultiConfigWindowComponent;
    let fixture: ComponentFixture<MultiConfigWindowComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    const minTimer = 30;
    const maxTimer = 300;
    const defaultTimer = 60;
    const incrementValue = 30;
    const iterationValue = 10;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            declarations: [MultiConfigWindowComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule, FormsModule],
            providers: [
                FormBuilder,
                CdkStepper,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
                { provide: SocketClientService, useValue: socketServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiConfigWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have timer initiated as 60', () => {
        expect(component.timer).toEqual(defaultTimer);
    });

    it('should not decrease timer below 30', () => {
        for (let _ = 0; _ < iterationValue; _++) component.decrementTime();
        expect(component.timer).toEqual(minTimer);
    });

    it('should not increase timer higher 300', () => {
        for (let _ = 0; _ < iterationValue; _++) component.incrementTime();
        expect(component.timer).toEqual(maxTimer);
    });

    it('should change timer by increments of 30', () => {
        component.incrementTime();
        expect(component.timer).toEqual(defaultTimer + incrementValue);
        component.incrementTime();
        expect(component.timer).toEqual(defaultTimer + incrementValue + incrementValue);
        component.decrementTime();
        expect(component.timer).toEqual(defaultTimer + incrementValue);
    });

    it('should increase timer when + button pressed', () => {
        const addButton = document.getElementsByTagName('button')[1];
        addButton.click();
        expect(component.timer).toEqual(defaultTimer + incrementValue);
    });

    it('should decrease timer when - button pressed', () => {
        const subButton = document.getElementsByTagName('button')[0];
        subButton.click();
        expect(component.timer).toEqual(defaultTimer - incrementValue);
    });

    it('should not be possible to enter a name smaller then 3 characters', () => {
        component.settingsForm.controls.name.setValue('My');
        expect(component.settingsForm.controls.name.valid).toBeFalse();
    });

    it('should not be possible to enter a name bigger then 20 characters', () => {
        component.settingsForm.controls.name.setValue('a 21 characters name-');
        expect(component.settingsForm.controls.name.valid).toBeFalse();
    });

    it('should be able to have a name with different types of characters', () => {
        component.settingsForm.controls.name.setValue('ßý◄↕►☺♥ %ù{}# 14');
        expect(component.settingsForm.controls.name.valid).toBeTrue();
    });

    it('should be possible to enter a name between 3 and 20 characters long', () => {
        component.settingsForm.controls.name.setValue('Leo');
        expect(component.settingsForm.controls.name.valid).toBeTrue();
        component.settingsForm.controls.name.setValue('George');
        expect(component.settingsForm.controls.name.valid).toBeTrue();
        component.settingsForm.controls.name.setValue('George Washington');
        expect(component.settingsForm.controls.name.valid).toBeTrue();
        component.settingsForm.controls.name.setValue('a 20 characters name');
        expect(component.settingsForm.controls.name.valid).toBeTrue();
    });

    it('should not be submittable if the inputs are empty', () => {
        const fakeSubmit = () => {
            return;
        };
        const spy = spyOn(component, 'onSubmit').and.callFake(fakeSubmit);
        expect(component.settingsForm.controls.name.valid).toBeFalse();
        expect(component.settingsForm.controls.selectedDictionary.valid).toBeFalse();
        expect(component.settingsForm.valid).toBeFalse();
        fixture.detectChanges();
        // Verification que le bouton ne peut pas être pressé
        const submitButton = document.getElementsByTagName('button')[2];
        submitButton.click();
        expect(submitButton.disabled).toBeTrue();
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should be submittable if the inputs are filled', () => {
        const fakeSubmit = () => {
            return;
        };
        const spy = spyOn(component, 'onSubmit').and.callFake(fakeSubmit);
        component.settingsForm.controls.name.setValue('My Name');
        component.settingsForm.controls.selectedDictionary.setValue('My Dictionary');
        fixture.detectChanges();
        expect(component.settingsForm.valid).toBeTrue();

        const submitButton = document.getElementsByTagName('button')[2];
        // Verification que le bouton peut être pressé
        expect(submitButton.disabled).toBeFalse();
        submitButton.click();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should send the create room socket when submitted', () => {
        const spy = spyOn(component.socketService, 'send');
        const eventName = 'create room';
        component.settingsForm.controls.name.setValue('My Name');
        component.settingsForm.controls.selectedDictionary.setValue('My Dictionary');
        fixture.detectChanges();
        const submitButton = document.getElementsByTagName('button')[2];
        submitButton.click();
        const startTimer = 60;
        const expectedGameOptions = { hostname: 'My Name', dictionaryType: 'My Dictionary', timePerRound: startTimer };
        expect(spy).toHaveBeenCalledWith(eventName, expectedGameOptions);
    });

    it('should handle receive dictionaries event with the dictionaries names from the server', () => {
        const serverDictionary = ['My dictionary', 'My other Dictionary'];
        socketHelper.peerSideEmit('receive dictionaries', serverDictionary);
        expect(component.dictionaries).toBe(serverDictionary);
    });

    it('should not be able to reconnect after the initialization', () => {
        const spy = spyOn(socketServiceMock, 'connect');
        component.connect();
        expect(spy).toHaveBeenCalledTimes(0);
    });
});
