import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BoardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('sequence should be equal', () => {
        const numberSequence: number[] = component.numberSequence(5);
        const letterSequence: string[] = component.letterSequence(5);
        expect(numberSequence).toEqual([1, 2, 3, 4, 5]);
        expect(letterSequence).toEqual(['A', 'B', 'C', 'D', 'E']);
    });
});
