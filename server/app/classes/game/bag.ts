import { GameConfig } from '@app/classes/game-config';
import { Letter } from '@app/classes/letter';

export class Bag {
    letters: Letter[];

    constructor(config: GameConfig) {
        this.letters = [];
        config.letters.forEach((l) => {
            for (let i = 0; i < l.amount; i++) this.letters.push(l.letter);
        });
    }

    exchangeLetters(old: Letter[]): Letter[] {
        old.forEach((l) => this.letters.push(l));
        return this.getLetters(old.length);
    }

<<<<<<< HEAD
    getLetters(amt: number): Letter[] {
        const letterArray: Letter[] = [];
        for (let i = 0; i < amt && this.letters.length > 0; i++)
            letterArray.push(this.letters.splice(Math.round(Math.random() * this.letters.length), 1)[0]);
        return letterArray;
=======
    getLetters(amount: number): Letter[] {
        const val: Letter[] = [];
        for (let i = 0; i < amount && this.letters.length > 0; i++)
            val.push(this.letters.splice(Math.round(Math.random() * this.letters.length), 1)[0]);
        return val;
>>>>>>> 795226c3e71f41cc98ec1185b897ba99e5ac6c8d
    }
}
