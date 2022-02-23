import { Letter } from 'common/classes/letter';

export const EASEL_CAPACITY = 7;

export const copyPlayer = (player: Player) => {
    const playerCopy = new Player(player.name);
    playerCopy.easel = player.easel;
    playerCopy.score = player.score;
    return playerCopy;
};

export class Player {
    easel: Letter[];
    score: number;

    constructor(public name: string) {
        this.easel = [];
        this.score = 0;
    }

    removeLettersFromEasel(lettersToRemove: Letter[]): void {
        const letters = [...lettersToRemove];
        this.easel = this.easel.filter((x) => {
            const i = letters.indexOf(x);
            if (i > 0) letters.splice(i, 1);
            return i < 0;
        });
    }

    addLettersToEasel(lettersToAdd: Letter[]): void {
        if (this.easel.length + lettersToAdd.length > EASEL_CAPACITY)
            throw new Error(`The easel capacity has been exceeded: ${this.easel.length + lettersToAdd.length}`);
        this.easel = this.easel.concat(lettersToAdd);
    }
}
