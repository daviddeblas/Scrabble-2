import dictionaryJson from '@app/../assets/dictionary.json';
import { Dictionary } from '@app/classes/dictionary';
import { BLANK_LETTER, Letter, lettersToString } from '@app/classes/letter';
import io from 'socket.io';
import { Service } from 'typedi';
// TODO pouvoir changer de dictionnaire

@Service()
export class DictionaryService {
    dictionary: Dictionary = Object.assign(new Dictionary(), dictionaryJson);

    setupSocketConnection(socket: io.Socket) {
        socket.on('get dictionaries', () => {
            socket.emit('receive dictionaries', ['Mon dictionnaire']);
        });
    }

    isWord(word: Letter[]): boolean {
        // TODO remplacer cette recherche lineaire qui est trop longue
        return this.dictionary.words.find((w) => new RegExp(lettersToString(word).toLowerCase().replace('*', '.')).test(w)) === undefined;
    }

    getMatchingWords(word: Letter[]): string[] {
        if (word.findIndex((char) => char === BLANK_LETTER) < 0) return [lettersToString(word).toLowerCase()];
        return this.dictionary.words.filter((w) => new RegExp(lettersToString(word).toLowerCase().replace('*', '.')).test(w));
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
