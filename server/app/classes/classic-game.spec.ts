import { AMT_OF_LETTERS_IN_EASEL, BOARD_HEIGHT, BOARD_WIDTH, ClassicGame } from '@app/classes/classic-game';
import { Letter, stringToLetters } from '@app/classes/letter';
import { DictionaryService } from '@app/services/dictionary.service';
import { GameConfigService } from '@app/services/game-config.service';
import { expect } from 'chai';
import Container from 'typedi';
import { GameError } from './game.exception';
import { Multiplier, MultiplierType } from './multiplier';
import { PlacedLetter } from './placed-letter';
import { Vec2 } from './vec2';

describe('ClassicGame', () => {
    let dictionary: DictionaryService;
    let game: ClassicGame;
    let hasActivated: boolean;

    const finishFunction = () => {
        hasActivated = true;
    };

    beforeEach(() => {
        dictionary = Container.get(DictionaryService);
        const letterConfig = Container.get(GameConfigService);
        game = new ClassicGame(dictionary, letterConfig, finishFunction);
        hasActivated = false;
    });

    it('game constructor should be be correct', () => {
        expect(game.activePlayer).to.eq(0);
        expect(game.players.length).to.eq(2);
        game.players.forEach((player) => {
            expect(player.easel.length).to.eq(AMT_OF_LETTERS_IN_EASEL);
        });
        expect(game.board.length).to.eq(BOARD_WIDTH);
        game.board.forEach((arr) => {
            expect(game.board.length).to.eq(BOARD_HEIGHT);
            arr.forEach((letter) => {
                expect(letter).to.equal(null);
            });
        });
        expect(game.players.length).to.eq(2);
        expect(game.pointPerLetter.size).to.eq('abcdefghijklmnopqrstuvwxyz*'.length);
        let sum = 0;
        Container.get(GameConfigService)
            .getConfigFromName('Classic')
            .letters.forEach((l) => {
                sum += l.amt;
            });
        expect(game.letterPot.length).to.eq(sum - AMT_OF_LETTERS_IN_EASEL * 2);
    });

    it('draw executes correctly', () => {
        const originalLetterPotLength = game.letterPot.length;
        let activePlayer = game.activePlayer;
        let lettersToDraw: Letter[] = [];
        let activePlayerEasel = [...game.players[game.activePlayer].easel];
        let oldEasel = [...game.players[game.activePlayer].easel];
        for (let i = 0; i < AMT_OF_LETTERS_IN_EASEL; i++) {
            lettersToDraw.push(activePlayerEasel.splice(Math.floor(Math.random() * activePlayerEasel.length), 1)[0]);
        }
        game.draw(lettersToDraw, game.activePlayer);
        expect(game.letterPot.length).to.eq(originalLetterPotLength);
        expect(game.players[activePlayer].easel).to.not.deep.eq(oldEasel);
        expect(game.activePlayer).to.not.eq(activePlayer);
        activePlayer = game.activePlayer;
        lettersToDraw = [];
        activePlayerEasel = [...game.players[game.activePlayer].easel];
        oldEasel = [...game.players[game.activePlayer].easel];
        for (let i = 0; i < AMT_OF_LETTERS_IN_EASEL; i++) {
            lettersToDraw.push(activePlayerEasel.splice(Math.floor(Math.random() * activePlayerEasel.length), 1)[0]);
        }
        game.draw(lettersToDraw, game.activePlayer);
        expect(game.letterPot.length).to.eq(originalLetterPotLength);
        expect(game.players[activePlayer].easel).to.not.deep.eq(oldEasel);
        expect(game.activePlayer).to.not.eq(activePlayer);
    });

    it('draw throws if command is invalid', () => {
        expect(() => {
            game.draw([], game.activePlayer);
        }).to.throw(GameError);
        expect(() => {
            game.draw([game.players[game.activePlayer].easel[0]], (game.activePlayer + 1) % game.players.length);
        }).to.throw(GameError);
        expect(() => {
            game.draw(stringToLetters('abcdefgh'), game.activePlayer);
        }).to.throw(GameError);
        game.players[game.activePlayer].easel = stringToLetters('bcdefgh');
        expect(() => {
            game.draw(stringToLetters('a'), game.activePlayer);
        }).to.throw(GameError);
        game.letterPot = [];
        expect(() => {
            game.draw(stringToLetters('a'), game.activePlayer);
        }).to.throw(GameError);
    });

    it('skip turn should execute correctly', () => {
        const activePlayer = game.activePlayer;
        game.skip(activePlayer);
        expect(game.activePlayer).to.not.eq(activePlayer);
    });

    it('skip turn should throw if active player is invalid', () => {
        expect(() => {
            game.skip((game.activePlayer + 1) % game.players.length);
        }).to.throw(GameError);
    });

    it('place words work', () => {
        let originalLetterPotLength = game.letterPot.length;
        game.players[game.activePlayer].easel = stringToLetters('bonyuia');
        let originalEasel = [...game.players[game.activePlayer].easel];
        game.multipliers[6][6] = new Multiplier(2, MultiplierType.Letter);
        expect(() => {
            game.place([new PlacedLetter('B' as Letter, new Vec2(0, 0))], game.activePlayer);
        }).to.throw();

        let lettersToAdd: PlacedLetter[] = [
            new PlacedLetter('B' as Letter, new Vec2(5, 6)),
            new PlacedLetter('O' as Letter, new Vec2(6, 6)),
            new PlacedLetter('N' as Letter, new Vec2(7, 6)),
        ];
        game.place(lettersToAdd, game.activePlayer);
        expect(game.activePlayer).to.eq(1);
        expect(game.players[0].easel.length).to.eq(AMT_OF_LETTERS_IN_EASEL);
        expect(game.board[lettersToAdd[0].position.x][lettersToAdd[0].position.y]).to.eq(lettersToAdd[0].letter);
        expect(game.board[lettersToAdd[1].position.x][lettersToAdd[1].position.y]).to.eq(lettersToAdd[1].letter);
        expect(game.board[lettersToAdd[2].position.x][lettersToAdd[2].position.y]).to.eq(lettersToAdd[2].letter);
        expect(game.letterPot.length).to.eq(originalLetterPotLength - lettersToAdd.length);
        expect(game.players[0].easel).to.not.deep.equal(originalEasel);
        expect(game.players[0].score).to.eq(6);

        originalLetterPotLength = game.letterPot.length;
        game.players[game.activePlayer].easel = stringToLetters('bonyuia');
        originalEasel = [...game.players[game.activePlayer].easel];
        game.multipliers[7][4] = new Multiplier(2, MultiplierType.Word);
        lettersToAdd = [new PlacedLetter('B' as Letter, new Vec2(7, 4)), new PlacedLetter('O' as Letter, new Vec2(7, 5))];
        game.place(lettersToAdd, game.activePlayer);
        expect(game.activePlayer).to.eq(0);
        expect(game.players[1].easel.length).to.eq(AMT_OF_LETTERS_IN_EASEL);
        expect(game.board[lettersToAdd[0].position.x][lettersToAdd[0].position.y]).to.eq(lettersToAdd[0].letter);
        expect(game.board[lettersToAdd[1].position.x][lettersToAdd[1].position.y]).to.eq(lettersToAdd[1].letter);
        expect(game.letterPot.length).to.eq(originalLetterPotLength - lettersToAdd.length);
        expect(game.players[game.activePlayer].easel).to.not.deep.equal(originalEasel);
        expect(game.players[1].score).to.eq(5 * 2);
        expect(game.multipliers[7][4]).to.eq(null);
    });

    it('place word throws', () => {
        game.players[game.activePlayer].easel = [
            'B' as Letter,
            'B' as Letter,
            'B' as Letter,
            'B' as Letter,
            'B' as Letter,
            'B' as Letter,
            'B' as Letter,
        ];
        expect(() => game.place([new PlacedLetter('B' as Letter, new Vec2(6, 6))], game.activePlayer)).to.throw();
        expect(() =>
            game.place([new PlacedLetter('B' as Letter, new Vec2(6, 6)), new PlacedLetter('B' as Letter, new Vec2(6, 7))], game.activePlayer),
        ).to.throw();
    });

    it('endgame on skips', () => {
        for (let i = 0; i < 6; i++) game.skip(game.activePlayer);
        expect(hasActivated).to.eq(true);
    });

    it('endgame on empty', () => {
        game.letterPot = [];
        game.players.forEach((p) => {
            p.easel = [];
        });
        game.skip(game.activePlayer);
        expect(hasActivated).to.eq(true);
    });

    it('endgame default', () => {
        game = new ClassicGame(Container.get(DictionaryService), Container.get(GameConfigService));
        for (let i = 0; i < 6; i++) game.skip(game.activePlayer);
    });
});
