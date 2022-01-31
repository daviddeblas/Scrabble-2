import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmSurrenderDialogComponent } from './confirm-surrender-dialog.component';

describe('ConfirmSurrenderComponent', () => {
    let component: ConfirmSurrenderDialogComponent;
    let fixture: ComponentFixture<ConfirmSurrenderDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfirmSurrenderDialogComponent],
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
});
