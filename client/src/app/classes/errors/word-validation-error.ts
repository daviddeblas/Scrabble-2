import { Word } from '@app/classes/word';

export enum ValidationReason {
    NotInDictionary,
    OutOfBound,
}

export class WordValidationError extends Error {
    word: Word;
    reason: ValidationReason;
}
