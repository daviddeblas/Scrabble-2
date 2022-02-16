const DEFAULT_TIME = 60;

export class GameOptions {
    constructor(public hostname: string, public dictionaryType: string, public timePerRound: number = DEFAULT_TIME) {}
}
