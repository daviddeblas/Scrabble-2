import { DictionaryService } from '@app/services/dictionary.service';
import { expect } from 'chai';
import { Container } from 'typedi';
import { stringToLetters } from '@app/classes/letter';

describe('Dictionary Service', () => {
    let service: DictionaryService;

    beforeEach(async () => {
        service = Container.get(DictionaryService);
    });

    it('isWord should return true if the word exists', async () => {
        const aa = stringToLetters('aa');
        expect(service.isWord(aa));
        const zythums = stringToLetters('zythums');
        expect(service.isWord(zythums));
    });
    it('isWord should return false if the word does not exist', async () => {
        const ax = stringToLetters('ax');
        expect(!service.isWord(ax));
        const zzzzz = stringToLetters('zzzzz');
        expect(service.isWord(zzzzz));
    });
});
