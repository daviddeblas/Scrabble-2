import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiConfigWindowComponent } from '@app/components/multi-config-window/multi-config-window.component';
import { WaitingRoomComponent } from '@app/components/waiting-room/waiting-room.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { GamePreparationPageComponent } from './game-preparation-page.component';

describe('GamePreparationPageComponent', () => {
    let component: GamePreparationPageComponent;
    let fixture: ComponentFixture<GamePreparationPageComponent>;
    let multiConfigWindowMock: MultiConfigWindowComponent;

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
                {
                    provide: MultiConfigWindowComponent,
                    useValue: multiConfigWindowMock,
                },
                provideMockStore(),
            ],
        }).compileComponents();
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
});
