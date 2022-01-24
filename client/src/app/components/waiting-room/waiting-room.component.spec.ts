import { CdkStepper } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { WaitingRoomComponent } from './waiting-room.component';

describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    const mockDialogSpy: { close: jasmine.Spy } = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule],
            providers: [
                {
                    provide: CdkStepper,
                },
                {
                    provide: MatDialogRef,
                    useValue: mockDialogSpy,
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
});
