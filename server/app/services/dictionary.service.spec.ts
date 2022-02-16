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
        expect(service.isWord(aa)).to.eq(true);
        const zythums = stringToLetters('zythums');
        expect(service.isWord(zythums)).to.eq(true);
    });

    it('isWord should return false if the word does not exist', async () => {
        const ax = stringToLetters('ax');
        expect(service.isWord(ax)).to.eq(false);
        const zzzzz = stringToLetters('zzzzz');
        expect(service.isWord(zzzzz)).to.eq(false);
    });

    it('getMatchingWords should return the correct words without blanks', async () => {
        expect(service.getMatchingWords(stringToLetters('co*')).find((w) => w === 'con')).to.not.eq(undefined);
    });

    it('getMatchingWordsFromBlank', () => {
        expect(service.determineLetterFromBlanks([stringToLetters('co*'), stringToLetters('co*')])).to.eq('b');
    });
});
