import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ChatService } from './chat.service';
// eslint-disable dot-notation
fdescribe('ChatService', () => {
    let service: ChatService;
    // const mockStore = new MockStore<MockAppState>(emptyState);
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [{ provide: Store, useValue: {} }] }).compileComponents();
        service = TestBed.inject(ChatService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('validatePlaceCommand should return true when the command is properly called', () => {
        const exampleCommand = ['!placer', 'a11h', 'abcpzoe'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeTrue();
    });

    it('validateExchangeCommand should return false when there are more than 3 parts to the command', () => {
        const exampleCommand = ['!placer', 'a11h', 'abcpzoe', 'last part'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false when the line letter is not from a to o', () => {
        const exampleCommand = ['!placer', 'v11h', 'abcpzoe'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false when the direction char is not h or v', () => {
        const exampleCommand = ['!placer', 'a11i', 'abcpzoe'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false when the last part is not only letters', () => {
        const exampleCommand = ['!placer', 'a11h', 'a_cp8oe'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return true if there is no direction letter but only 1 letter is placed', () => {
        const exampleCommand = ['!placer', 'a11', 'a'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeTrue();
    });

    it('validateExchangeCommand should return false if the number is greater than 15', () => {
        const exampleCommand = ['!placer', 'a16v', 'abcpzoe'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return false if there is not only letters and numbers in the second part', () => {
        const exampleCommand = ['!placer', 'a1.6v_', 'abcpzoe'];
        // eslint-disable-next-line dot-notation
        expect(service['validatePlaceCommand'](exampleCommand)).toBeFalse();
    });

    it('validateExchangeCommand should return true if only letters are in the second part', () => {
        const exampleCommand = ['!échanger', 'abcpzoe'];
        // eslint-disable-next-line dot-notation
        expect(service['validateExchangeCommand'](exampleCommand)).toBeTrue();
    });

    it('validateExchangeCommand should return false if the second part contains anything else than letters', () => {
        const exampleCommand = ['!échanger', 'ab1pz.e'];
        // eslint-disable-next-line dot-notation
        expect(service['validateExchangeCommand'](exampleCommand)).toBeFalse();
    });
});
