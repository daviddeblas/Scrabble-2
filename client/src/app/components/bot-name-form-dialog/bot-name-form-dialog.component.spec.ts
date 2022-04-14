import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { addBotName, modifyBotName } from '@app/actions/bot-names.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { BotNameFormDialogComponent } from './bot-name-form-dialog.component';

describe('BotNameFormDialogComponent', () => {
    const mockDialogSpy: { close: jasmine.Spy } = {
        close: jasmine.createSpy('close'),
    };

    let component: BotNameFormDialogComponent;
    let fixture: ComponentFixture<BotNameFormDialogComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
            declarations: [BotNameFormDialogComponent],
            providers: [
                FormBuilder,
                provideMockStore(),
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
                {
                    provide: MatDialogRef,
                    useValue: mockDialogSpy,
                },
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BotNameFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should change validator if oldName is not undefined', () => {
        const oldName = 'Title';
        component.oldName = oldName;
        component.ngOnInit();
        expect(component.settingsForm.controls.difficulty.validator).toEqual(Validators.nullValidator);
    });

    it('onSubmit should dispatch addBotName with name and difficulty if oldName is undefined', () => {
        const name = 'My NAme';
        const difficulty = 'Débutant';
        component.settingsForm.controls.name.setValue(name);
        component.settingsForm.controls.difficulty.setValue(difficulty);
        const expectedAction = cold('a', { a: addBotName({ name, difficulty }) });
        component.onSubmit();
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('onSubmit should dispatch addBotName with name and difficulty if oldName is undefined and close dialogRef', () => {
        const name = 'My NAme';
        const difficulty = 'Débutant';
        component.settingsForm.controls.name.setValue(name);
        component.settingsForm.controls.difficulty.setValue(difficulty);
        const expectedAction = cold('a', { a: addBotName({ name, difficulty }) });
        component.onSubmit();
        expect(store.scannedActions$).toBeObservable(expectedAction);
        expect(mockDialogSpy.close).toHaveBeenCalled();
    });

    it('onSubmit should dispatch modifyBotName with names and difficulty if oldName is no undefined and close dialogRef', () => {
        const name = 'My NAme';
        const difficulty = 'Débutant';
        const oldName = 'Title';

        component.settingsForm.controls.name.setValue(name);
        component.currentDifficulty = difficulty;
        fixture.detectChanges();
        component.oldName = oldName;
        const expectedAction = cold('a', { a: modifyBotName({ oldName, newName: name, difficulty }) });
        component.onSubmit();
        expect(store.scannedActions$).toBeObservable(expectedAction);
        expect(mockDialogSpy.close).toHaveBeenCalled();
    });
});
