import { Letter } from '@app/classes/letter';

export class Bag {
    letters: Letter[];

    exchangeLetters(old: Letter[]): Letter[] {
        return this.getLetters(old.length);
    }

    getLetters(amt: number): Letter[] {
        const val: Letter[] = [];
        for (let i = 0; i < amt; i++) val.push(this.letters.splice(Math.round(Math.random() * this.letters.length), 1)[0]);
        return val;
    }
}
