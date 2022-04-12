import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { DictionariesAdministratorComponent } from './dictionaries-administrator.component';

describe('DictionariesAdministratorComponent', () => {
    let component: DictionariesAdministratorComponent;
    let fixture: ComponentFixture<DictionariesAdministratorComponent>;
    const mockDialogSpy: { open: jasmine.Spy } = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [DictionariesAdministratorComponent],
            providers: [
                provideMockStore(),
                {
                    provide: MatDialog,
                    useValue: mockDialogSpy,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionariesAdministratorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
