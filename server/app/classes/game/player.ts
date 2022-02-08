import { Letter } from '@app/classes/letter';
import { GameError, GameErrorType } from '@app/classes/game.exception';

export class Player {
    easel: Letter[];
    score: number;

    constructor(public name: string) {
        this.easel = [];
        this.score = 0;
    }

    removeLetters(letters: Letter[]): void {
        const playerTempEasel = [...this.easel];
        // validation
        letters.forEach((l) => {
            const index = playerTempEasel.indexOf(l);
            if (index < 0) throw new GameError(GameErrorType.LettersAreNotInEasel);
            playerTempEasel.splice(index, 1);
        });

        // execution
        letters.forEach((l) => {
            this.easel.splice(
                this.easel.findIndex((letter) => letter === l),
                1,
            );
        });
    }

    addLetters(letters: Letter[]): void {
        letters.forEach((l) => this.easel.push(l));
    }
}
