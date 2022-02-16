import { Letter } from '@app/classes/letter';

export class LetterConfigItem {
    constructor(public letter: Letter, public points: number, public amount: number) {}
}
