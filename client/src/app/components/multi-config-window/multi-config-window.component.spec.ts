import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameOptions } from '@app/classes/game-options';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { MultiConfigWindowComponent } from './multi-config-window.component';

describe('MultiConfigWindowComponent', () => {
    let component: MultiConfigWindowComponent;
    let fixture: ComponentFixture<MultiConfigWindowComponent>;
    const iterationAmount = 10;

    beforeEach(async () => {
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
                provideMockStore(),
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
        expect(component.timer).toEqual(component.defaultTimer);
    });

    it('should not decrease timer below 30', () => {
        for (let _ = 0; _ < iterationAmount; _++) component.decrementTime();
        expect(component.timer).toEqual(component.minTime);
    });

    it('should not increase timer higher 300', () => {
        for (let _ = 0; _ < iterationAmount; _++) component.incrementTime();
        expect(component.timer).toEqual(component.maxTime);
    });

    it('should change timer by increments of 30', () => {
        component.incrementTime();
        expect(component.timer).toEqual(component.defaultTimer + component.timerIncrement);
        component.incrementTime();
        expect(component.timer).toEqual(component.defaultTimer + 2 * component.timerIncrement);
        component.decrementTime();
        expect(component.timer).toEqual(component.defaultTimer + component.timerIncrement);
    });

    it('should increase timer when + button pressed', () => {
        const addButton = document.getElementsByTagName('button')[1];
        addButton.click();
        expect(component.timer).toEqual(component.defaultTimer + component.timerIncrement);
    });

    it('should decrease timer when - button pressed', () => {
        const subButton = document.getElementsByTagName('button')[0];
        subButton.click();
        expect(component.timer).toEqual(component.defaultTimer - component.timerIncrement);
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

    it('should emit with gameOptions when submitted and is not a solo game', () => {
        component.settingsForm.controls.name.setValue('My Name');
        component.settingsForm.controls.selectedDictionary.setValue('My Dictionary');
        fixture.detectChanges();
        const emitSpy = spyOn(component.gameOptionsSubmitted, 'emit');
        component.onSubmit();
        const expectedGameOptions = new GameOptions('My Name', 'My Dictionary', component.timer);
        expect(emitSpy).toHaveBeenCalledOnceWith({ gameOptions: expectedGameOptions });
    });

    it('should emit with gameOptions and playerLevel when submitted and it is a solo game', () => {
        component.settingsForm.controls.name.setValue('My Name');
        component.settingsForm.controls.selectedDictionary.setValue('My Dictionary');
        component.isSoloGame = true;
        fixture.detectChanges();
        const emitSpy = spyOn(component.gameOptionsSubmitted, 'emit');
        component.onSubmit();
        const expectedGameOptions = new GameOptions('My Name', 'My Dictionary', component.timer);
        const expectedLevel = 'Débutant';
        expect(emitSpy).toHaveBeenCalledOnceWith({ gameOptions: expectedGameOptions, botLevel: expectedLevel });
    });
});
