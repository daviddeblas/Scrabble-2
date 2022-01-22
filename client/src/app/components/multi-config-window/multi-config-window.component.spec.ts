import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { of } from 'rxjs';
import { MultiConfigWindowComponent } from './multi-config-window.component';

export class FormGroupMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}

fdescribe('MultiConfigWindowComponent', () => {
    let component: MultiConfigWindowComponent;
    let fixture: ComponentFixture<MultiConfigWindowComponent>;
    const minTimer = 30;
    const maxTimer = 300;
    const startValue = 60;

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
        expect(component.timer).toEqual(startValue);
    });

    it('should not decrease timer below 30', () => {
        for (let _ = 0; _ < 5; _++) component.decrementTime();
        expect(component.timer).toEqual(minTimer);
    });

    it('should not increase timer higher 300', () => {
        for (let _ = 0; _ < 10; _++) component.incrementTime();
        expect(component.timer).toEqual(maxTimer);
    });

    it('should change timer by increments of 30', () => {
        component.incrementTime();
        expect(component.timer).toEqual(startValue + 30);
        component.incrementTime();
        expect(component.timer).toEqual(startValue + 60);
        component.decrementTime();
        expect(component.timer).toEqual(startValue + 30);
    });

    it('should increase timer when + button pressed', () => {
        const addButton = document.getElementsByTagName('button')[1];
        addButton.click();
        expect(component.timer).toEqual(startValue + 30);
    });

    it('should decrease timer when - button pressed', () => {
        const subButton = document.getElementsByTagName('button')[0];
        subButton.click();
        expect(component.timer).toEqual(startValue - 30);
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
        spyOn(component, 'onSubmit');
        expect(component.settingsForm.controls.name.valid).toBeFalse();
        expect(component.settingsForm.controls.selectedDictionary.valid).toBeFalse();
        expect(component.settingsForm.valid).toBeFalse();
        fixture.detectChanges();
        // Verification que le bouton ne peut pas être pressé
        const submitButton = document.getElementsByTagName('button')[2];
        submitButton.click();
        expect(submitButton.disabled).toBeTrue();
        expect(component.onSubmit).toHaveBeenCalledTimes(0);
    });

    it('should be submittable if the inputs are filled', () => {
        spyOn(component, 'onSubmit');
        component.settingsForm.controls.name.setValue('My Name');
        component.settingsForm.controls.selectedDictionary.setValue('My Dictionary');
        fixture.detectChanges();
        expect(component.settingsForm.valid).toBeTrue();

        const submitButton = document.getElementsByTagName('button')[2];
        // Verification que le bouton peut être pressé
        expect(submitButton.disabled).toBeFalse();
        submitButton.click();
        expect(component.onSubmit).toHaveBeenCalledTimes(1);
    });
});
