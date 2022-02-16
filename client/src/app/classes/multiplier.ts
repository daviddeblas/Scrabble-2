export enum MultiplierType {
    Word = 'Word',
    Letter = 'Letter',
}

export class Multiplier {
    constructor(public amount: number, public type: MultiplierType = MultiplierType.Letter) {}
}
