import * as chatAction from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { initialState, reducer } from '@app/reducers/chat.reducer';
describe('[Chat] Received message', () => {
    const chatMessageStub: ChatMessage[] = [
        {
            username: 'Brian',
            message: 'is in the kitchen',
        },
    ];

    it('should receive the message', () => {
        const action = chatAction.chatMessageReceived({
            username: 'Brian',
            message: 'is in the kitchen',
        });

        const result = reducer(initialState, action);

        expect(result).toEqual(chatMessageStub);
        expect(result).not.toBe(chatMessageStub);
    });
});
