export class GameError extends Error {
    constructor(public type: GameErrorType) {
        super(type);
    }
}

export enum GameErrorType {
    NotEnoughLetters = 'Not enough letters in the pot',
    WrongPlayer = 'It is not this players turn',
    LettersAreNotInEasel = 'This players easel does not contain those letters',
    PositionOccupied = 'This letter position on board is already taken',
    InvalidWord = 'This letter placement creates an invalid word',
    LetterIsNull = 'Unexpected null letter',
    UndefinedPoints = 'This letter does not have an associated point count',
    WrongPosition = 'This word is in the wrong position',
}
