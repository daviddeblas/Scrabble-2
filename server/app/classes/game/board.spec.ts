import { GameConfigService } from '@app/services/game-config.service';
import { expect } from 'chai';
import Container from 'typedi';
import { Vec2 } from '@app/classes/vec2';
import { Board } from './board';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Multiplier, MultiplierType } from '../multiplier';

describe('board', () => {
    let board: Board;
    const gameConfig = Container.get(GameConfigService).configs.configs[0];

    beforeEach(() => {
        board = new Board(gameConfig);
    });

    it('constructor', () => {
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
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        board.place(lettersToPlace);
        // eslint-disable-next-line dot-notation
        expect(board['getAffectedWordFromSinglePlacement'](new Vec2(1, 0), new Vec2(7, 7))).to.deep.eq(lettersToPlace);
    });

    it('getAffectedWords should be correct', () => {
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        // eslint-disable-next-line dot-notation
        const words = board['getAffectedWords'](lettersToPlace);
        words[0].forEach((l, index) => expect(l.equals(lettersToPlace[index])).to.eq(true));
    });

    it('scorePositions', () => {
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        board.place(lettersToPlace);

        expect(board.scorePositions(lettersToPlace.map((l) => l.position))).to.eq(
            lettersToPlace.map((l) => board.pointsPerLetter.get(l.letter) as number).reduce((sum, points) => sum + points),
        );
    });

    it('scorePositions with multiplier letter', () => {
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        board.multipliers[7][7] = new Multiplier(2, MultiplierType.Letter);
        board.place(lettersToPlace);

        expect(board.scorePositions(lettersToPlace.map((l) => l.position))).to.eq(
            lettersToPlace.map((l) => board.pointsPerLetter.get(l.letter) as number).reduce((sum, points) => sum + points) + 1,
        );
    });

    it('scorePositions with multiplier letter', () => {
        const lettersToPlace = [new PlacedLetter('C', new Vec2(6, 7)), new PlacedLetter('O', new Vec2(7, 7)), new PlacedLetter('N', new Vec2(8, 7))];
        board.multipliers[7][7] = new Multiplier(2, MultiplierType.Word);
        board.place(lettersToPlace);

        expect(board.scorePositions(lettersToPlace.map((l) => l.position))).to.eq(
            lettersToPlace.map((l) => board.pointsPerLetter.get(l.letter) as number).reduce((sum, points) => sum + points) * 2,
        );
    });

    it('letterAt', () => {
        board.board[0][0] = 'A';
        expect(board.letterAt(new Vec2(0, 0))).to.eq('A');
        expect(board.letterAt(new Vec2(1, 0))).to.eq(null);
    });

    it('copy', () => {
        const copy = board.copy();
        expect(copy.board.length).to.eq(board.board.length);
        expect(copy.multipliers.length).to.eq(board.multipliers.length);
        expect(copy.pointsPerLetter).to.deep.eq(board.pointsPerLetter);
        expect(copy.blanks).to.deep.eq(board.blanks);
    });
});
