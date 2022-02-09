export enum MultiplierType {
    Word = 'Word',
    Letter = 'Letter',
}

export class Multiplier {
    constructor(public amt: number, public type: MultiplierType = MultiplierType.Letter) {}
    copy(): Multiplier {
        return new Multiplier(this.amt, this.type);
    }
}
