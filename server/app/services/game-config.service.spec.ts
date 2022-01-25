import { GameConfigService } from '@app/services/game-config.service';
import { expect } from 'chai';
import { Container } from 'typedi';
import { describe } from 'mocha';
import { Letter } from '@app/classes/letter';

describe('Letter config service', () => {
    let service: GameConfigService;
    beforeEach(() => {
        service = Container.get(GameConfigService);
    });

    it('getConfigFromName with "Classic" as input should return the classic letter config', () => {
        const config = service.getConfigFromName('Classic');
        expect(config.name).to.eq('Classic');
        const letterConfigItem = config.letters.find((l) => l.letter === ('A' as Letter));
        expect(letterConfigItem).to.not.eq(undefined);
        expect(letterConfigItem?.letter).to.eq('A' as Letter);
        expect(letterConfigItem?.points).to.eq(1);
        expect(letterConfigItem?.amt).to.eq(9);
    });

    it('getConfigFromName with invalid input should throw', () => {
        expect(() => {
            service.getConfigFromName('a');
        }).to.throw();
    });
});
