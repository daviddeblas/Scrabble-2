import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('DictionariesAdministratorComponent', () => {
    let component: DictionariesAdministratorComponent;
    let fixture: ComponentFixture<DictionariesAdministratorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DictionariesAdministratorComponent],
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
