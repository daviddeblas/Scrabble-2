import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createRoom } from '@app/actions/room.actions';
import { GameOptions } from '@app/classes/game-options';
import { MultiConfigWindowComponent } from '@app/components/multi-config-window/multi-config-window.component';
import { WaitingRoomComponent } from '@app/components/waiting-room/waiting-room.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { GamePreparationPageComponent } from './game-preparation-page.component';

describe('GamePreparationPageComponent', () => {
    let component: GamePreparationPageComponent;
    let fixture: ComponentFixture<GamePreparationPageComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePreparationPageComponent, MultiConfigWindowComponent, WaitingRoomComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
            providers: [
                FormBuilder,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
                provideMockStore(),
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePreparationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return multiConfigWindowComponent.settingsForm if multiConfigWindowComponent is initialized ', () => {
        component.multiConfigWindowComponent = jasmine.createSpyObj('MultiConfigWindowComponent', [], ['formSettings']);
        expect(component.formSettings).toEqual(component.multiConfigWindowComponent.settingsForm);
    });

    it('should not return multiConfigWindowComponent.settingsForm if multiConfigWindowComponent is initialized ', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        component.multiConfigWindowComponent = undefined!;
        expect(component.formSettings).toEqual(component.firstFormGroup);
    });

    it('should dispatch createRoom with the gameOptions when onGameOptionsSubmit called', () => {
        const expectedOptions = { name: 'My Name' } as unknown as GameOptions;
        component.onGameOptionsSubmit(expectedOptions);
        const expectedAction = cold('a', { a: createRoom({ gameOptions: expectedOptions }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });
});
