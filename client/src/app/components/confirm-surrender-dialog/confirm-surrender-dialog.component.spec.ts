import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { ConfirmSurrenderDialogComponent } from './confirm-surrender-dialog.component';

describe('ConfirmSurrenderComponent', () => {
    let component: ConfirmSurrenderDialogComponent;
    let fixture: ComponentFixture<ConfirmSurrenderDialogComponent>;
    const mockDialogSpy: { close: jasmine.Spy } = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfirmSurrenderDialogComponent],
            imports: [AppMaterialModule],
            providers: [ 
                { 
                    provide: MAT_DIALOG_DATA, 
                    useValue: {} },
                {
                    provide: MatDialogRef,
                    useValue: mockDialogSpy,
                }
            ]
                
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmSurrenderDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the window when the accept button is clicked', () => {
        component.closeDialog();
        expect(mockDialogSpy.close).toHaveBeenCalled();
    });

    it('should call the closeDialog method when surrenderGame is called', () => {
        const spy = spyOn(component, "closeDialog");
        component.surrenderGame();
        expect(spy).toHaveBeenCalled();
    });
});
