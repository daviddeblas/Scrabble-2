import { Letter } from 'common/classes/letter';
import { Vec2, vec2ToBoardPosition } from 'common/classes/vec2';
import { BOARD_SIZE } from 'common/constants';
import { Dictionary } from './dictionary';
import { PlacedLetter } from './placed-letter';

interface Segment {
    value: string;
    start: number;
    end: number;
}

interface Word {
    word: string;
    index: number;
}

interface Line {
    letters: (Letter | null)[];
    blanks: number[];
}

interface Solution {
    letters: PlacedLetter[];
    blanks: Vec2[];
    direction: Vec2;
}

export class Solver {
    constructor(private dictionary: Dictionary, private board: (Letter | null)[][], private easel: Letter[]) {}

    findAllSolutions(): Solution[] {
        const solutions: Solution[] = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            solutions.push(...this.findLineSolutions(this.board[i], i, new Vec2(0, 1)));
        }
        for (let i = 0; i < BOARD_SIZE; i++) {
            const line = this.board.reduce((r, v) => [...r, v[i]], []);
            solutions.push(...this.findLineSolutions(line, i, new Vec2(1, 0)));
        }
        return solutions;
    }

    getHints(): string[] {
        const allSolutions: Solution[] = this.findAllSolutions(); // TODO ne pas chercher tout le board
        if (allSolutions.length < 1) return [];
        let solutions: Solution[] = [];
        if (allSolutions.length > 3) {
            for (let i = 0; i < HINT_COUNT; i++) {
                Math.floor(((Math.random() + i) * solutions.length) / HINT_COUNT);
                solutions.push(allSolutions[i]);
            }
        } else {
            solutions = allSolutions;
        }

        const hints: string[] = [];

        for (const solution of solutions) {
            let pos = vec2ToBoardPosition(solution.letters[0].position.flip()); // le board est inversé??
            pos += solution.direction.equals(new Vec2(1, 0)) ? 'h' : 'v';

            let lettersString = '';
            for (const letter of solution.letters) {
                if (solution.blanks.find((v) => v.equals(letter.position))) {
                    lettersString += letter.letter.toUpperCase();
                } else {
                    lettersString += letter.letter.toLowerCase();
                }
            }
            hints.push(`!placer ${pos} ${lettersString}`);
        }

        return hints;
    }

    findLineSolutions(line: (Letter | null)[], index: number, direction: Vec2): Solution[] {
        if (line.every((letter) => letter === null)) return []; // toutes les lettres sont null

        const segments = this.generateSegments(line);
        const regex = this.generateRegex(line, segments);
        const searchResults = this.dictionarySearch(regex, segments);
        const placedWords = this.filterDuplicateLetters(line, searchResults);

        const result: Solution[] = [];
        const lineStart = direction.flip().mul(index);

        for (const word of placedWords) {
            const solution: Solution = { letters: [], blanks: [], direction };
            let valid = true;
            for (let i = 0; i < word.letters.length; i++) {
                if (word.letters[i] === null) continue;
                const letterPos = lineStart.add(direction.mul(i));

                let perpendicularWord: string = word.letters[i] as Letter;

                let k = letterPos.sub(direction.flip());
                while (k.x >= 0 && k.y >= 0 && this.board[k.x][k.y] !== null) {
                    perpendicularWord = this.board[k.x][k.y] + perpendicularWord;
                    k = k.sub(direction.flip());
                }

                k = letterPos.add(direction.flip());
                while (k.x < BOARD_SIZE && k.y < BOARD_SIZE && this.board[k.x][k.y] !== null) {
                    perpendicularWord = perpendicularWord + this.board[k.x][k.y];
                    k = k.add(direction.flip());
                }

                if (perpendicularWord.length > 1) {
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    if (this.dictionary.words.indexOf(perpendicularWord.toLowerCase()) === -1) {
                        valid = false;
                        break;
                    }
                }

                const placedLetter = new PlacedLetter(word.letters[i] as Letter, letterPos);
                solution.letters.push(placedLetter);
            }
            if (!valid) continue;

            for (const blank of word.blanks) {
                solution.blanks.push(lineStart.add(direction.mul(blank)));
            }

            result.push(solution);
        }
        return result;
    }

    generateSegments(line: (Letter | null)[]): Segment[] {
        const segments: Segment[] = [];

        let pos = 0;
        while (pos < line.length) {
            while (line[pos] === null && pos < line.length) pos++;
            if (pos === line.length) break;

            const segment: Segment = { start: pos, value: '', end: pos };
            while (line[pos] !== null && pos < line.length) {
                segment.value += line[pos];
                pos++;
            }

            segment.end = pos;
            segments.push(segment);
        }

        return segments;
    }

    generateRegex(line: (Letter | null)[], segments: Segment[]): RegExp {
        const easelText = this.easel.includes('*') ? 'a-z' : this.easel.join('');

        const regexParts = [];

        for (let i = 0; i < segments.length; i++) {
            let regexPart = `(?:(?!${segments[i].value}$)`;
            if (segments[i].start !== 0) {
                const left = i === 0 ? segments[i].start : segments[i].start - segments[i - 1].end - 1;
                regexPart += `([${easelText}]{0,${left}}|^)`;
            } else {
                regexPart += '()';
            }

            regexPart += segments[i].value;

            for (let j = i; j < segments.length; j++) {
                if (j + 1 < segments.length) {
                    const spacing = segments[j + 1].start - segments[j].end;
                    regexPart += `(?:[${easelText}]{${spacing - 1}}$|[${easelText}]{${spacing}}${segments[j + 1].value}|$)`;
                } else if (segments[j].end < line.length) {
                    const spacing = line.length - segments[j].end;
                    regexPart += `(?:[${easelText}]{1,${spacing}}|$)`;
                }
            }

            regexPart += ')';
            regexParts.push(regexPart);
        }

        return new RegExp(`^(?:${regexParts.join('|')})$`, 'i');
    }

    dictionarySearch(regex: RegExp, segments: Segment[]): Word[] {
        const matches: Word[] = [];
        this.dictionary.words.forEach((w) => {
            const match = regex.exec(w);
            if (match) {
                let i = 0;
                while (match[i + 1] === undefined) i++;
                matches.push({ word: w, index: segments[i].start - match[i + 1].length });
            }
        });
        return matches;
    }

    filterDuplicateLetters(line: (Letter | null)[], words: Word[]): Line[] {
        const matches: Line[] = [];
        words.forEach((w) => {
            const insertedLine: Line = { letters: new Array(line.length).fill(null), blanks: [] };
            insertedLine.letters.splice(w.index, w.word.length, ...(Array.from(w.word.toUpperCase()) as Letter[]));
            const easelTmp = [...this.easel];

            for (let i = w.index; i < w.index + w.word.length; i++) {
                if (line[i] === null) {
                    let index = easelTmp.indexOf(insertedLine.letters[i] as Letter);
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    if (index === -1) {
                        index = easelTmp.indexOf('*');
                        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                        if (index === -1) return;
                        insertedLine.blanks.push(i);
                    }

                    easelTmp.splice(index, 1);
                } else {
                    insertedLine.letters[i] = null;
                }
            }
            matches.push(insertedLine);
        });
        return matches;
    }
}
