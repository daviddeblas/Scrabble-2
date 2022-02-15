import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkipTurnButtonComponent } from './skip-turn-button.component';

describe('SkipTurnButtonComponent', () => {
    let component: SkipTurnButtonComponent;
    let fixture: ComponentFixture<SkipTurnButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SkipTurnButtonComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkipTurnButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
