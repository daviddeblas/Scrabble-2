import { Letter } from '@app/classes/letter';
import { GameConfig } from '@app/classes/game-config';

export class Bag {
    letters: Letter[];

    constructor(config: GameConfig) {
        this.letters = [];
        config.letters.forEach((l) => {
            for (let i = 0; i < l.amt; i++) this.letters.push(l.letter);
        });
    }

    exchangeLetters(old: Letter[]): Letter[] {
        old.forEach((l) => this.letters.push(l));
        return this.getLetters(old.length);
    }

    getLetters(amt: number): Letter[] {
        const letterArray: Letter[] = [];
        for (let i = 0; i < amt && this.letters.length > 0; i++)
            letterArray.push(this.letters.splice(Math.round(Math.random() * this.letters.length), 1)[0]);
        return letterArray;
    }
}
