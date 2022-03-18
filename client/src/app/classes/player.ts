import { Letter } from 'common/classes/letter';
import { EASEL_CAPACITY } from 'common/constants';

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
        const easelCopy = [...this.easel];
        letters.forEach((l) => {
            const i = easelCopy.findIndex((letter) => l === letter);
            if (i < 0) return;
            easelCopy.splice(i, 1);
        });

        this.easel = easelCopy;
    }

    addLettersToEasel(lettersToAdd: Letter[]): void {
        if (this.easel.length + lettersToAdd.length > EASEL_CAPACITY)
            throw new Error(`The easel capacity has been exceeded: ${this.easel.length + lettersToAdd.length}`);
        this.easel = this.easel.concat(lettersToAdd);
    }
}
