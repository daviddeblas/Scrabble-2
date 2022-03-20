/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-lines */
import { Dictionary } from '@app/classes/dictionary';
import { expect } from 'chai';
import { Letter } from 'common/classes/letter';
import { Vec2 } from 'common/classes/vec2';
import { BOARD_SIZE, MAX_BOT_PLACEMENT_TIME } from 'common/constants';
import { assert } from 'console';
import { spy, stub } from 'sinon';
import { Board } from './game/board';
import { PlacedLetter } from './placed-letter';
import { HINT_COUNT, Line, Solution, Solver, Word } from './solver';

describe.only('solver', () => {
    const dictionary: Dictionary = new Dictionary('', '', []);
    let board: Board;
    beforeEach(() => {
        board = {
            // eslint-disable-next-line no-unused-vars
            scorePosition: (word: PlacedLetter[]) => {
                return 0;
            },
        } as Board;
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

    it('should return correct regex from segments when starting line', () => {
        const solver: Solver = new Solver(dictionary, board, ['C', 'D']);
        const regex = solver.generateRegex([
            {
                start: 0,
                end: 1,
                value: 'X',
            },
        ]);
        expect(regex.source).to.equal('^(?:(?:(?!X$)()X(?:[CD]{1,14}|$)))$');
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

    it('should filter duplicate letters', () => {
        const solver: Solver = new Solver(dictionary, board, ['A', 'B', '*']);
        const fakeLine: (Letter | null)[] = [null, null, null, null, 'C', null, null, null, null, null, null, null, null, null, null];
        const fakeWords: Word[] = [
            {
                word: 'abca',
                index: 2,
            },
            {
                word: 'aaca',
                index: 2,
            },
        ];
        const expectedLines: Line[] = [
            {
                letters: [null, null, 'A', 'B', null, 'A', null, null, null, null, null, null, null, null, null],
                blanks: [5],
            },
        ];
        expect(solver.filterDuplicateLetters(fakeLine, fakeWords)).to.deep.equals(expectedLines);
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

    it('should not search when line is null', () => {
        const dictionarySample = { words: ['aaa'] } as Dictionary;
        const solver: Solver = new Solver(dictionarySample, board, []);

        const generateSegmentsSpy = spy(solver, 'generateSegments');
        const generateRegexSpy = spy(solver, 'generateRegex');
        const dictionarySearchSpy = spy(solver, 'dictionarySearch');
        const filterDuplicateLettersSpy = spy(solver, 'filterDuplicateLetters');
        const filterInvalidAffectedWordsSpy = spy(solver, 'filterInvalidAffectedWords');

        const solutions = solver.findLineSolutions(
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            5,
            new Vec2(1, 0),
        );
        expect(solutions).to.deep.equal([]);

        assert(generateSegmentsSpy.notCalled);
        assert(generateRegexSpy.notCalled);
        assert(dictionarySearchSpy.notCalled);
        assert(filterDuplicateLettersSpy.notCalled);
        assert(filterInvalidAffectedWordsSpy.notCalled);
    });

    it('should search solution for a line', () => {
        const dictionarySample = { words: ['abc', 'abcd', 'zabcdr', 'abcx', 'rabcx'] } as Dictionary;
        board.board[7] = [null, null, null, null, null, 'A', 'B', 'C', null, null, null, null, null, null, null];
        const solver: Solver = new Solver(dictionarySample, board, ['D', 'Z', 'R', 'E', 'N', 'E', 'E']);

        const generateSegmentsSpy = spy(solver, 'generateSegments');
        const generateRegexSpy = spy(solver, 'generateRegex');
        const dictionarySearchSpy = spy(solver, 'dictionarySearch');
        const filterDuplicateLettersSpy = spy(solver, 'filterDuplicateLetters');
        const filterInvalidAffectedWordsSpy = spy(solver, 'filterInvalidAffectedWords');

        const solutions = solver.findLineSolutions(
            [null, null, null, null, null, 'A', 'B', 'C', null, null, null, null, null, null, null],
            7,
            new Vec2(0, 1),
        );
        const expected: Solution[] = [
            {
                letters: [new PlacedLetter('D', new Vec2(7, 8))],
                blanks: [],
                direction: new Vec2(0, 1),
            },
            {
                letters: [new PlacedLetter('Z', new Vec2(7, 4)), new PlacedLetter('D', new Vec2(7, 8)), new PlacedLetter('R', new Vec2(7, 9))],
                blanks: [],
                direction: new Vec2(0, 1),
            },
        ];

        expect(solutions).to.deep.equal(expected);

        assert(generateSegmentsSpy.calledOnce);
        assert(generateRegexSpy.calledOnce);
        assert(dictionarySearchSpy.calledOnce);
        assert(filterDuplicateLettersSpy.calledOnce);
        assert(filterInvalidAffectedWordsSpy.calledOnce);
    });

    it('should search solution for each line', () => {
        const solver: Solver = new Solver(dictionary, board, []);
        const expected: Solution[] = [];

        stub(solver, 'isBoardEmpty').returns(false);

        const findLineStub = stub(solver, 'findLineSolutions');
        findLineStub.callsFake((_line: (Letter | null)[], _index: number, direction: Vec2) => {
            const sol: Solution = {
                letters: [],
                blanks: [],
                direction,
            };
            expected.push(sol);
            return [sol];
        });

        const solutions = solver.findAllSolutions();

        expect(solutions).to.deep.equal(expected);
        assert(findLineStub.callCount === BOARD_SIZE * 2);
    });

    it('should return nothing if time expire', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        stub(solver, 'isBoardEmpty').returns(false);

        const findLineStub = stub(solver, 'findLineSolutions');
        findLineStub.callsFake((_line: (Letter | null)[], _index: number, direction: Vec2) => {
            const sol: Solution = {
                letters: [],
                blanks: [],
                direction,
            };
            return [sol];
        });

        let fakeNow: number;
        let fakeNowIncrement: number;
        const dateNowStub = stub(Date, 'now').callsFake(() => {
            fakeNow += fakeNowIncrement;
            return fakeNow;
        });

        fakeNow = 0;
        fakeNowIncrement = (MAX_BOT_PLACEMENT_TIME / BOARD_SIZE) * 2;
        let result = solver.findAllSolutions();
        expect(result).to.deep.equal([]);

        fakeNow = 0;
        fakeNowIncrement = (MAX_BOT_PLACEMENT_TIME / BOARD_SIZE) * 0.75;
        result = solver.findAllSolutions();
        expect(result).to.deep.equal([]);

        dateNowStub.restore();
    });

    it('should return random solutions', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        const mathRandomStub = stub(Math, 'random').returns(0.5);

        const solutions: Solution[] = [...new Array(9)].map((_v, i) => {
            return {
                letters: [],
                blanks: [],
                direction: new Vec2(0, i),
            };
        });

        const result = solver.pickRandomSolutions(solutions);
        expect(result).to.deep.equal([solutions[1], solutions[4], solutions[7]]);

        mathRandomStub.restore();
    });

    it('should return all solutions when not enough choice', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        const solutions: Solution[] = [...new Array(HINT_COUNT - 1)].map((_v, i) => {
            return {
                letters: [],
                blanks: [],
                direction: new Vec2(0, i),
            };
        });

        const result = solver.pickRandomSolutions(solutions);
        expect(result).to.deep.equal(solutions);
    });

    it('should return command arguments', () => {
        const solution: Solution = {
            letters: [new PlacedLetter('C', new Vec2(4, 7)), new PlacedLetter('D', new Vec2(8, 7)), new PlacedLetter('E', new Vec2(9, 7))],
            blanks: [new Vec2(8, 7)],
            direction: new Vec2(1, 0),
        };

        const commandArg = Solver.solutionToCommandArguments(solution);
        expect(commandArg).to.equal('h5h cDe');
    });

    it('should return solution strings', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        const solutions: Solution[] = [
            {
                letters: [new PlacedLetter('A', new Vec2(7, 8)), new PlacedLetter('B', new Vec2(7, 8))],
                blanks: [],
                direction: new Vec2(0, 1),
            },
            {
                letters: [new PlacedLetter('C', new Vec2(4, 7)), new PlacedLetter('D', new Vec2(8, 7)), new PlacedLetter('E', new Vec2(9, 7))],
                blanks: [new Vec2(8, 7)],
                direction: new Vec2(1, 0),
            },
        ];

        const hints = solver.solutionsToHints(solutions);
        expect(hints).to.deep.equal(['!placer i8v ab', '!placer h5h cDe']);
    });

    it('should return no hints when no solutions', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        const findSolutionStub = stub(solver, 'findAllSolutions').returns([]);

        const pickRandomSolutionsSpy = spy(solver, 'pickRandomSolutions');
        const solutionsToHintsSpy = spy(solver, 'solutionsToHints');

        const results = solver.getHints();
        expect(results).to.deep.equals([]);

        assert(findSolutionStub.calledOnce);
        assert(pickRandomSolutionsSpy.notCalled);
        assert(solutionsToHintsSpy.notCalled);
    });

    it('should hints', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        const solutions: Solution[] = [...new Array(2)].map((_v, i) => {
            return {
                letters: [],
                blanks: [],
                direction: new Vec2(0, i),
            };
        });

        const findSolutionStub = stub(solver, 'findAllSolutions').returns(solutions);
        const pickRandomSolutionsSpy = spy(solver, 'pickRandomSolutions');
        const solutionsToHintsStub = stub(solver, 'solutionsToHints').returns(['abcdef']);

        const results = solver.getHints();
        expect(results).to.deep.equals(['abcdef']);

        assert(findSolutionStub.calledOnce);
        assert(pickRandomSolutionsSpy.calledWith(solutions));
        assert(solutionsToHintsStub.calledWith(solutions));
    });

    it('should return easy bot solution', () => {
        const solver: Solver = new Solver(dictionary, board, []);

        const solutions: Solution[] = [...new Array(2)].map((v, i) => {
            return {
                letters: [],
                blanks: [],
                direction: new Vec2(0, i),
            };
        });

        const scorePositionStub = stub(board, 'scorePosition').returns(5);
        const findAllSolutionsStub = stub(solver, 'findAllSolutions').returns(solutions);

        const results = solver.getEasyBotSolutions();
        expect(results).to.deep.equals(solutions.map((s) => [s, 5]));

        assert(scorePositionStub.calledTwice);
        assert(findAllSolutionsStub.calledOnce);
    });

    it('should return no easy bot solution', () => {
        const solver: Solver = new Solver(dictionary, board, []);
        const findAllSolutionsStub = stub(solver, 'findAllSolutions').returns([]);
        const results = solver.getEasyBotSolutions();
        expect(results).to.deep.equals([]);
        assert(findAllSolutionsStub.calledOnce);
    });

    it('should return if board is empty', () => {
        const dictionarySample = { words: ['c', 'abcfdd', 'zabcdr', 'adgbcx', 'rabcx'] } as Dictionary;
        const solver: Solver = new Solver(dictionarySample, board, ['A', 'B', 'C', '*']);

        expect(solver.isBoardEmpty()).to.equal(true);

        board.board[7] = [null, null, null, null, null, null, null, 'A', null, null, null, null, null, null, null];
        expect(solver.isBoardEmpty()).to.equal(false);
    });

    it('should generate first solution from words', () => {
        const dictionarySample = { words: ['c', 'abcfdd', 'zabcdr', 'adgbcx', 'rabcx'] } as Dictionary;
        const solver: Solver = new Solver(dictionarySample, board, ['A', 'B', 'C', '*']);

        const fakeSolution = [
            {
                letters: [],
                blanks: [],
                direction: new Vec2(1, 0),
            },
        ];

        const firstSolutionTransformStub = stub(solver, 'firstSolutionTransform').returns(fakeSolution);
        const firstSolutionRegexSpy = spy(solver, 'firstSolutionRegex');

        const solution = solver.findFirstSolutions();
        expect(solution).to.equal(fakeSolution);

        assert(firstSolutionTransformStub.called);
        assert(firstSolutionRegexSpy.called);
    });

    it('should generate first solution regex', () => {
        const solver: Solver = new Solver(dictionary, board, ['A', 'B', 'C']);
        const regex = solver.firstSolutionRegex();
        expect(regex.source).to.equal('^(?!(?:[^A]*A){2})(?!(?:[^B]*B){2})(?!(?:[^C]*C){2}).{1,3}$');
    });

    it('should generate first solution regex with blank', () => {
        const solver: Solver = new Solver(dictionary, board, ['A', 'B', 'C', '*']);
        const regex = solver.firstSolutionRegex();
        expect(regex.source).to.equal('^(?!(?:[^A]*A){3})(?!(?:[^B]*B){3})(?!(?:[^C]*C){3})(?!(?:[ABC]*[^ABC]){2}).{1,4}$');
    });

    it('should generate first solution from words', () => {
        const solver: Solver = new Solver(dictionary, board, ['A', 'B', 'C', '*']);
        const words: string[] = ['aabc', 'aaab', 'zab', 'c', 'zzab'];
        const expected: Solution[] = [
            {
                letters: [
                    new PlacedLetter('A', new Vec2(7, 7)),
                    new PlacedLetter('A', new Vec2(8, 7)),
                    new PlacedLetter('B', new Vec2(9, 7)),
                    new PlacedLetter('C', new Vec2(10, 7)),
                ],
                blanks: [new Vec2(8, 7)],
                direction: new Vec2(1, 0),
            },
            {
                letters: [new PlacedLetter('Z', new Vec2(7, 7)), new PlacedLetter('A', new Vec2(8, 7)), new PlacedLetter('B', new Vec2(9, 7))],
                blanks: [new Vec2(7, 7)],
                direction: new Vec2(1, 0),
            },
            {
                letters: [new PlacedLetter('C', new Vec2(7, 7))],
                blanks: [],
                direction: new Vec2(1, 0),
            },
        ];

        const results = solver.firstSolutionTransform(words);
        expect(results).to.deep.equal(expected);
    });
});
