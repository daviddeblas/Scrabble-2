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
        return this.getLetters(old.length);
    }

    getLetters(amt: number): Letter[] {
        const val: Letter[] = [];
        for (let i = 0; i < amt; i++) val.push(this.letters.splice(Math.round(Math.random() * this.letters.length), 1)[0]);
        return val;
    }
}
