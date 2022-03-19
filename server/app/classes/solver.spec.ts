/* eslint-disable @typescript-eslint/no-magic-numbers */
import dictionaryJson from '@app/../assets/dictionary.json';
import { Dictionary } from '@app/classes/dictionary';
import { expect } from 'chai';
import { Vec2 } from 'common/classes/vec2';
import { BOARD_SIZE } from 'common/constants';
import { Board } from './game/board';
import { PlacedLetter } from './placed-letter';
import { Solution, Solver } from './solver';

describe.only('solver', () => {
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

    it('should search in dictionary with regex', () => {
        const dictionarySample = { words: ['arbre', 'cactus', 'sapin'] } as Dictionary;
        const solver: Solver = new Solver(dictionarySample, board, []);
        const words = solver.dictionarySearch(/^(.*)b/i, [{ start: 4, end: 5, value: 'B' }]);

        expect(words).to.deep.equal([
            {
                word: 'arbre',
                index: 2,
            },
        ]);
    });

    it('should filter invalid affected words', () => {
        const dictionarySample = { words: ['aaa', 'bbb'] } as Dictionary;
        // prettier-ignore
        {
            board.board[3] = [null, null, null, null, null, null,  'A', null, null,  'C', null, null, null, null, null];
            board.board[4] = [null, null, null, null, null, null,  'A', null, null,  'C', null, null, null, null, null];
            board.board[5] = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
            board.board[6] = [null, null, null, null, null, null, null, null,  'B', null, null, null, null, null, null];
            board.board[7] = [null, null, null, null, null, null, null, null,  'B', null, null, null, null, null, null];
        }
        const solver: Solver = new Solver(dictionarySample, board, []);
        const solutions = solver.filterInvalidAffectedWords(
            [
                { letters: [null, null, null, null, null, null, 'A', null, 'B', 'C', null, null, null, null, null], blanks: [] },
                { letters: [null, null, null, null, null, null, 'A', null, 'B', null, null, null, null, null, null], blanks: [8] },
            ],
            new Vec2(0, 1),
            new Vec2(5, 0),
        );

        const expected: Solution[] = [
            {
                letters: [new PlacedLetter('A', new Vec2(5, 6)), new PlacedLetter('B', new Vec2(5, 8))],
                blanks: [new Vec2(5, 8)],
                direction: new Vec2(0, 1),
            },
        ];

        expect(solutions).to.deep.equal(expected);
    });
});
