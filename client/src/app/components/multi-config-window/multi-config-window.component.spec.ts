import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
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

describe('MultiConfigWindowComponent', () => {
    let component: MultiConfigWindowComponent;
    let fixture: ComponentFixture<MultiConfigWindowComponent>;
    const minTimer = 30;
    const maxTimer = 300;
    const startValue = 60;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultiConfigWindowComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule],
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

    it('should have as timer as 60', () => {
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
});
