import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { SurrenderGameButtonComponent } from './surrender-game-button.component';

describe('SurrenderGameComponent', () => {
    let component: SurrenderGameButtonComponent;
    let fixture: ComponentFixture<SurrenderGameButtonComponent>;
    const mockDialogSpy: { open: jasmine.Spy } = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SurrenderGameButtonComponent],
            imports: [AppMaterialModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: mockDialogSpy,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurrenderGameButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('openConfirmSurrenderDialog should open the window when the begin button is clicked', () => {
        component.openConfirmSurrenderDialog();
        expect(mockDialogSpy.open).toHaveBeenCalled();
    });

    it('surrender button should call openConfirmSurrenderDialog', () => {
        const spy = spyOn(component, 'openConfirmSurrenderDialog');
        document.getElementsByTagName('button')[0].click();
        expect(spy).toHaveBeenCalled();
    });
});
