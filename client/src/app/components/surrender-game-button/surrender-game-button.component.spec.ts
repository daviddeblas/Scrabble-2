import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { SurrenderGameButtonComponent } from './surrender-game-button.component';

describe('SurrenderGameComponent', () => {
    let component: SurrenderGameButtonComponent;
    let fixture: ComponentFixture<SurrenderGameButtonComponent>;
    let mockDialogSpy: jasmine.SpyObj<MatDialog>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        mockDialogSpy = jasmine.createSpyObj('dialog', ['open']);
        routerMock = jasmine.createSpyObj('router', ['navigateByUrl']);
        await TestBed.configureTestingModule({
            declarations: [SurrenderGameButtonComponent],
            imports: [AppMaterialModule],
            providers: [
                {
                    provide: Router,
                    useValue: routerMock,
                },
                provideMockStore(),
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

    it('quitGamePage should open the window when the begin button is clicked', () => {
        component.quitGamePage();
        expect(routerMock.navigateByUrl).toHaveBeenCalled();
    });
});
