import * as chatAction from '@app/actions/chat.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { ChatMessage } from '@app/interfaces/chat-message';
import { initialState, reducer } from '@app/reducers/chat.reducer';
describe('[Chat] Received message', () => {
    const chatMessageStub: ChatMessage = {
        username: 'Brian',
        message: 'is in the kitchen',
        messageType: 'Error',
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

    it('should reset to initial state', () => {
        const action = resetAllState();
        const result = reducer([chatMessageStub], action);

        expect(result).toEqual([]);
    });
});
