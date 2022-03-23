import { Letter, lettersToString } from 'common/classes/letter';

export class Dictionary {
    constructor(public title: string, public description: string, public words: string[]) {}

    isWord(word: Letter[]): boolean {
        return this.getMatchingWords(word).length > 0;
    }

    getMatchingWords(word: Letter[]): string[] {
        return this.words.filter((w) => new RegExp('^'.concat(lettersToString(word).toLowerCase().replace('*', '.').concat('$'))).test(w));
    }
}
