export enum MultiplierType {
    Word,
    Letter,
}

export class Multiplier {
    constructor(public amt: number, public type: MultiplierType = MultiplierType.Letter) {}
}
