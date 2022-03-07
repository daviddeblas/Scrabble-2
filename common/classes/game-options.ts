import { DEFAULT_TIMER } from '../constants';

export class GameOptions {
    constructor(public hostname: string, public dictionaryType: string, public timePerRound: number = DEFAULT_TIMER) {}
}
