import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { cancelJoinRoom, joinRoom, loadRooms } from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { RoomEffects } from '@app/effects/room.effects';
import { AppMaterialModule } from '@app/modules/material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { forbiddenNameValidator, GameJoinPageComponent } from './game-join-page.component';

describe('GameJoinPageComponent', () => {
    let component: GameJoinPageComponent;
    let fixture: ComponentFixture<GameJoinPageComponent>;
    let store: MockStore;
    let stepperMock: jasmine.SpyObj<MatStepper>;

    const roomInfoStub: RoomInfo = { roomId: 'id', gameOptions: { dictionaryType: 'dict', hostname: 'host', timePerRound: 60 } };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameJoinPageComponent],
            imports: [ReactiveFormsModule, FormsModule, AppMaterialModule, BrowserAnimationsModule],
            providers: [
                provideMockStore(),
                {
                    provide: RoomEffects,
                    useValue: jasmine.createSpyObj('roomEffects', [], ['dialogRef']),
                },
                { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameJoinPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch "[Room] Load Rooms" when constructor', () => {
        const expectedAction = cold('a', { a: loadRooms() });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('selectRoom should set the selectedRoom with the room infos', () => {
        component.selectRoom(roomInfoStub);
        expect(component.selectedRoom).toBe(roomInfoStub);
    });

    it('joinRoom should dispatch "[Room] Join Room" with the selected room and disable the name field', () => {
        component.selectRoom(roomInfoStub);
        const username = 'username';
        component.formGroup.controls.name.setValue(username);

        component.joinGame();

        const expectedAction = cold('a', { a: joinRoom({ playerName: username, roomInfo: roomInfoStub }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);

        expect(component.formGroup.controls.name.enabled).toBeFalsy();
    });

    it('joinRoom should not dispatch "[Room] Join Room" if the selected room is undefined', () => {
        component.joinGame();

        const expectedAction = cold('a', { a: loadRooms() });
        expect(store.scannedActions$).toBeObservable(expectedAction);

        expect(component.formGroup.controls.name.enabled).toBeTruthy();
    });

    it('cancelJoin should dispatch "[Room] Cancel Join Room", unselect the room and reenable the name field', () => {
        component.selectRoom(roomInfoStub);
        component.formGroup.controls.name.disable();
        stepperMock = jasmine.createSpyObj<MatStepper>('Stepper', ['reset']);
        component.stepper = stepperMock;

        component.cancelJoin();

        const expectedAction = cold('a', { a: cancelJoinRoom({ roomInfo: roomInfoStub }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);

        expect(component.selectedRoom).toBeUndefined();
        expect(component.formGroup.controls.name.enabled).toBeTruthy();
        expect(stepperMock.reset).toHaveBeenCalled();
    });

    it('cancelJoin should not dispatch "[Room] Cancel Join Room" if the selected room is undefined', () => {
        component.cancelJoin();

        const expectedAction = cold('a', { a: loadRooms() });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('unselect should call re-setup the validator with no host names', () => {
        const spyOnSetupValidator = spyOn(component, 'setupNameValidators');

        component.unSelectRoom();

        expect(spyOnSetupValidator).toHaveBeenCalledWith('');
    });

    it('Our custom forbidden name custom validator should return a validation error only if hostname === player name', () => {
        const hostName = 'host';
        const customValidator = forbiddenNameValidator(hostName);
        const nameControl = component.formGroup.controls.name;

        nameControl.setValue(hostName);
        expect(customValidator(nameControl)).toEqual({ forbiddenName: { value: hostName } });

        nameControl.setValue('a new player');
        expect(customValidator(nameControl)).toBeNull();
    });
});
