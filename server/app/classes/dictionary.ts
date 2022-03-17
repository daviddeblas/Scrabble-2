import { BLANK_LETTER, Letter, lettersToString } from 'common/classes/letter';

export class Dictionary {
    title: string;
    description: string;
    words: string[];

    isWord(word: Letter[]): boolean {
        return this.getMatchingWords(word).length > 0;
    }

    getMatchingWords(word: Letter[]): string[] {
        return this.words.filter((w) => new RegExp('^'.concat(lettersToString(word).toLowerCase().replace('*', '.').concat('$'))).test(w));
    }

    determineLetterFromBlanks(letters: Letter[][]): Letter {
        const indexesOfBlank: number[] = [];
        const possibleWords: string[][] = [];
        letters.forEach((word) => {
            indexesOfBlank.push(word.findIndex((l) => l === BLANK_LETTER));
            possibleWords.push(this.getMatchingWords(word));
        });

        const possibleLetters: Letter[][] = [];

        possibleWords.forEach((words, index) => {
            possibleLetters.push([]);
            words.forEach((word) => {
                possibleLetters[index].push(word[indexesOfBlank[index]] as Letter);
            });
        });

        return possibleLetters[0].filter((l) => {
            return possibleLetters.filter((arr) => arr.findIndex((letter) => letter === l) >= 0).length > 0;
        })[0];
    }
}
