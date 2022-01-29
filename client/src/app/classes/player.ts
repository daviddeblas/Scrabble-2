import { Letter } from './letter';

export class Player {
    easel: Letter[];
    score: number;

    constructor(public name: string) {
        this.easel = [];
        this.score = 0;
    }

    removeLettersFromEasel(lettersToRemove: Letter[]): void {
        this.easel.filter((x) => {
            const i = lettersToRemove.indexOf(x);
            if (i > 0) lettersToRemove.splice(i, 1);
            return i > 0;
        });
    }

    addLettersToEasel(lettersToAdd: Letter[]): void {
        this.easel.concat(lettersToAdd);
    }
}
