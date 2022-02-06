import { WordValidationError } from './word-validation-error';

describe('WordValidationError', () => {
    it('should create an instance', () => {
        expect(new WordValidationError()).toBeTruthy();
    });
});
