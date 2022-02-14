import * as chatAction from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { initialState, reducer } from '@app/reducers/chat.reducer';
describe('[Chat] Received message', () => {
    const chatMessageStub: ChatMessage = {
        username: 'Brian',
        message: 'is in the kitchen',
        errorName: 'Error',
    };
    it('should receive the message', () => {
        const action = chatAction.receivedMessage(chatMessageStub);

        const result = reducer(initialState, action);

        expect(result).toEqual([chatMessageStub]);
        expect(result).not.toBe([chatMessageStub]);
    });

    it('should add the old messages', () => {
        const action = chatAction.restoreMessages({ oldMessages: [chatMessageStub] });
        const result = reducer(initialState, action);

        expect(result).toEqual([chatMessageStub]);
        expect(result).not.toBe([chatMessageStub]);
    });
});
