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

    it('numberSequence should be equal', () => {
        const sequenceLength = 5;
        /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
        const expectedSequence = [1, 2, 3, 4, 5];

        const numberSequence: number[] = component.numberSequence(sequenceLength);
        expect(numberSequence).toEqual(expectedSequence);
    });

    it('letterSequence should be equal', () => {
        const sequenceLength = 5;
        const expectedSequence = ['A', 'B', 'C', 'D', 'E'];

        const letterSequence: string[] = component.letterSequence(sequenceLength);
        expect(letterSequence).toEqual(expectedSequence);
    });
});
