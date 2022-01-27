import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameSelectionPageComponent } from './game-selection-page.component';

describe('GameSelectionPageComponent', () => {
    let component: GameSelectionPageComponent;
    let fixture: ComponentFixture<GameSelectionPageComponent>;
    const mockDialogSpy: { open: jasmine.Spy } = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameSelectionPageComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: mockDialogSpy,
                },
                FormBuilder,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameSelectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the window when the begin button is clicked', () => {
        component.openDialog();
        expect(mockDialogSpy.open).toHaveBeenCalled();
    });
});
