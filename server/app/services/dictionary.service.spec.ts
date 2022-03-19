import { DictionaryService } from '@app/services/dictionary.service';
import { Container } from 'typedi';

describe('Dictionary Service', () => {
    let service: DictionaryService;

    beforeEach(async () => {
        service = Container.get(DictionaryService);
    });

    it('init', () => {
        service.init();
    });
});
