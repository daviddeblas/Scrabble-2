import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmSurrenderComponent } from './confirm-surrender.component';

describe('ConfirmSurrenderComponent', () => {
    let component: ConfirmSurrenderComponent;
    let fixture: ComponentFixture<ConfirmSurrenderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfirmSurrenderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmSurrenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
