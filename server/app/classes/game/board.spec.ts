/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */

import { Multiplier, MultiplierType } from '@app/classes/multiplier';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';
import { GameConfigService } from '@app/services/game-config.service';
import { expect } from 'chai';
import Container from 'typedi';
import { Board, createEmptyMatrix } from './board';

describe('board', () => {
    let board: Board;
    const gameConfig = Container.get(GameConfigService).configs.configs[0];
    const correctLettersToPlace = [
        new PlacedLetter('C', new Vec2(6, 7)),
        new PlacedLetter('O', new Vec2(7, 7)),
        new PlacedLetter('N', new Vec2(8, 7)),
    ];

    beforeEach(() => {
        board = new Board(gameConfig);
    });

    it('CreateEmptyMatrix should initialize a double array filled with null', () => {
        const matrix = createEmptyMatrix(gameConfig.boardSize);

        expect(matrix.length).to.equal(gameConfig.boardSize.x);
        expect(matrix[0].length).to.equal(gameConfig.boardSize.y);
        expect(matrix[0][0]).to.equal(null);
        expect(matrix[gameConfig.boardSize.x - 1][gameConfig.boardSize.y - 1]).to.equal(null);
    });

    it('constructor with default game config should reflect its values', () => {
        expect(board.pointsPerLetter.get('A')).to.eq(gameConfig.letters.find((l) => l.letter === 'A')?.points);
        expect(board.blanks).to.deep.eq([]);
        expect(board.multipliers.length).to.eq(gameConfig.boardSize.x);
        board.multipliers.forEach((arr) => {
            expect(arr.length).to.eq(gameConfig.boardSize.y);
        });
        expect(board.board.length).to.eq(gameConfig.boardSize.x);
        board.board.forEach((arr) => {
            expect(arr.length).to.eq(gameConfig.boardSize.y);
        });
    });

    it('getAffectedWordFromSinglePlacement should be correct', () => {
        // place word 'con' across the 3 middle boxes
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        board.place(correctLettersToPlace, [], true);
        expect(board['getAffectedWordFromSinglePlacement'](new Vec2(1, 0), new Vec2(7, 7))).to.deep.eq(lettersToPlace);
    });

    it('getAffectedWords should be correct', () => {
        const words = board['getAffectedWords'](correctLettersToPlace);
        words[0].forEach((l, index) => expect(l.equals(correctLettersToPlace[index])).to.eq(true));
    });

    it('scorePositions should score accordingly on correct placement without any multiplier', () => {
        board.place(correctLettersToPlace, [], true);

        const expectedPoints = correctLettersToPlace.map((l) => board.pointsPerLetter.get(l.letter) as number).reduce((sum, points) => sum + points);
        expect(board.scorePositions(correctLettersToPlace.map((l) => l.position))).to.eq(expectedPoints);
    });

    it('scorePositions should score accordingly on correct placement with a single letter multiplier', () => {
        board.multipliers[7][7] = new Multiplier(2, MultiplierType.Letter);
        board.place(correctLettersToPlace, [], true);

        const expectedPoints = correctLettersToPlace.map((l) => board.pointsPerLetter.get(l.letter) as number).reduce((sum, points) => sum + points);
        const bonusFromMultiplier = 1;
        expect(board.scorePositions(correctLettersToPlace.map((l) => l.position))).to.eq(expectedPoints + bonusFromMultiplier);
    });

    it('scorePositions should score accordingly on correct placement with a single word multiplier', () => {
        board.multipliers[7][7] = new Multiplier(2, MultiplierType.Word);
        board.place(correctLettersToPlace, [], true);

        const expectedPoints = correctLettersToPlace.map((l) => board.pointsPerLetter.get(l.letter) as number).reduce((sum, points) => sum + points);
        const wordMultiplier = 2;
        expect(board.scorePositions(correctLettersToPlace.map((l) => l.position))).to.eq(expectedPoints * wordMultiplier);
    });

    it('place throws on wrong word', () => {
        const lettersToPlace = [new PlacedLetter('O', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        expect(() => board.place(lettersToPlace, [], true)).to.throw();
    });

    it('place throws on invalid placement', () => {
        const lettersToPlace = [new PlacedLetter('N', new Vec2(100, 7))];
        expect(() => board.place(lettersToPlace, [], true)).to.throw();
    });

    it('place throws on invalid input', () => {
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        expect(() => board.place(lettersToPlace, [], false)).to.throw();
    });

    it('place should add a blank to the blanks field', () => {
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        board.place(lettersToPlace, [1], true);
        expect(board.blanks.length).to.eq(1);
    });

    it('scoreWord throws on invalid position', () => {
        expect(() => board.scorePositions([new Vec2(0, 0)])).to.throw();
    });

    it('scorePositions should score accordingly on correct placement with multiple word multiplier', () => {
        board.multipliers[7][7] = new Multiplier(2, MultiplierType.Word);
        board.multipliers[6][7] = new Multiplier(3, MultiplierType.Word);
        board.place(correctLettersToPlace, [], true);

        const expectedPoints = correctLettersToPlace.map((l) => board.pointsPerLetter.get(l.letter) as number).reduce((sum, points) => sum + points);
        const wordMultiplier = 3;
        expect(board.scorePositions(correctLettersToPlace.map((l) => l.position))).to.eq(expectedPoints * wordMultiplier);
    });

    it('letterAt should return the same as if taken directly', () => {
        board.board[0][0] = 'A';
        expect(board.letterAt(new Vec2(0, 0))).to.eq(board.board[0][0]);
        expect(board.letterAt(new Vec2(1, 0))).to.eq(board.board[1][0]);
    });

    it('copy copies in depth', () => {
        const copy = board.copy();
        expect(copy.board.length).to.eq(board.board.length);
        expect(copy.multipliers.length).to.eq(board.multipliers.length);
        expect(copy.pointsPerLetter).to.deep.eq(board.pointsPerLetter);
        expect(copy.blanks).to.deep.eq(board.blanks);
    });
});
