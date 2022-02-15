export type Letter =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z'
    | '*';

export const stringToLetter = (string: string): Letter => {
    const error = new Error(`Invalid string input: ${string}`);
    if (string.length !== 1) throw error;
    if (string === string.toUpperCase()) return '*';
    const char = string.charAt(0).toUpperCase();
    if (!char.match(/[A-Z]|\*/)) throw error;
    return char as Letter;
};

export const stringToLetters = (string: string): Letter[] => {
    const returnValue: Letter[] = [];
    for (const s of string) returnValue.push(stringToLetter(s));
    return returnValue;
};

export const lettersToString = (letters: Letter[]): string => {
    let acc = '';
    letters.forEach((l) => (acc += l as string));
    return acc;
};
