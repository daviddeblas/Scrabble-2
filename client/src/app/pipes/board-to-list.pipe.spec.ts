import { PlacedLetter } from '@app/classes/placed-letter';
import { BoardState } from '@app/reducers/board.reducer';
import { BoardToListPipe } from './board-to-list.pipe';

describe('BoardToListPipe', () => {
    let pipe: BoardToListPipe;
    beforeEach(() => {
        pipe = new BoardToListPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return list of placed letters', () => {
        const boardState: BoardState = {
            board: [
                ['A', null],
                [null, 'B'],
            ],
            pointsPerLetter: new Map(),
            multipliers: [],
            blanks: [{ x: 1, y: 1 }],
        };

        const expected: PlacedLetter[] = [
            { letter: 'A', position: { x: 0, y: 0 }, blank: false },
            { letter: 'B', position: { x: 1, y: 1 }, blank: true },
        ];
        const result = pipe.transform(boardState);
        expect(result).toEqual(expected);
    });

    it('should return empty list of placed letters', () => {
        const result = pipe.transform(null);
        expect(result).toEqual([]);
    });
});
