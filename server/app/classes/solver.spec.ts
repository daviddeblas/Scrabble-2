import dictionaryJson from '@app/../assets/dictionary.json';
import { Dictionary } from '@app/classes/dictionary';
import { expect } from 'chai';
import { BOARD_SIZE } from 'common/constants';
import { Board } from './game/board';
import { Solver } from './solver';

describe('solver', () => {
    const dictionary: Dictionary = Object.assign(new Dictionary(), dictionaryJson);
    let board: Board;
    beforeEach(() => {
        board = {} as Board;
        board.board = [...new Array(BOARD_SIZE)].map(() => new Array(BOARD_SIZE).fill(null));
    });

    it('should return all segments from line', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        const segments = solver.generateSegments([null, 'A', 'B', null, 'C', 'D', null, null, null, 'E', null, null, null, null, 'F']);
        expect(segments).to.deep.equal([
            {
                value: 'AB',
                start: 1,
                end: 3,
            },
            {
                value: 'CD',
                start: 4,
                end: 6,
            },
            {
                value: 'E',
                start: 9,
                end: 10,
            },
            {
                value: 'F',
                start: 14,
                end: 15,
            },
        ]);
    });

    it('should return correct regex from segments', () => {
        const solver: Solver = new Solver(dictionary, board, ['A', 'C', 'D']);
        const regex = solver.generateRegex([
            {
                start: 2,
                end: 3,
                value: 'H',
            },
            {
                start: 5,
                end: 6,
                value: 'A',
            },
        ]);
        expect(regex.source).to.equal(
            '^(?:(?:(?!H$)([ACD]{0,2}|^)H(?:[ACD]{1}$|[ACD]{2}A|$)(?:[ACD]{1,9}|$))|(?:(?!A$)([ACD]{0,1}|^)A(?:[ACD]{1,9}|$)))$',
        );
    });

    it('should return correct regex from segments when blanks', () => {
        const solver: Solver = new Solver(dictionary, board, ['*', 'C', 'D']);
        const regex = solver.generateRegex([
            {
                start: 2,
                end: 3,
                value: 'X',
            },
        ]);
        expect(regex.source).to.equal('^(?:(?:(?!X$)([a-z]{0,2}|^)X(?:[a-z]{1,12}|$)))$');
    });
});
