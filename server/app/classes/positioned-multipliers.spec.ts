import { expect } from 'chai';
import { Multiplier, MultiplierType } from './multiplier';
import { PositionedMultipliers } from './positioned-multipliers';
import { Vec2 } from './vec2';

describe('PositionedMultipliers', () => {
    it('constructor', () => {
        const mults = new PositionedMultipliers(new Multiplier(2), [new Vec2(1, 1)]);
        expect(mults.multiplier.type).to.eq(MultiplierType.Letter);
        expect(mults.multiplier.amount).to.eq(2);
        expect(mults.positions.length).to.eq(1);
        expect(mults.positions[0].x).to.eq(1);
        expect(mults.positions[0].y).to.eq(1);
    });
});
