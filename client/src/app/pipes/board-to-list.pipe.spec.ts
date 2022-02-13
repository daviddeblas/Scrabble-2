import { Letter } from '@app/classes/letter';
import { PlacedLetter } from '@app/classes/placed-letter';
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
        const board: (Letter | null)[][] = [
            ['A', null],
            [null, 'B'],
        ];
        const expected: PlacedLetter[] = [
            { letter: 'A', position: { x: 0, y: 0 } },
            { letter: 'B', position: { x: 1, y: 1 } },
        ];
        const result = pipe.transform(board);
        expect(result).toEqual(expected);
    });

    it('should return empty list of placed letters', () => {
        const result = pipe.transform(null);
        expect(result).toEqual([]);
    });
});
