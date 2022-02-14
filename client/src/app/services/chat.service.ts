import { Injectable } from '@angular/core';
import { receivedMessage } from '@app/actions/chat.actions';
import { exchangeLetters, placeWord } from '@app/actions/player.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { ASCII_ALPHABET_POSITION, BOARD_SIZE, POSITION_LAST_CHAR } from '@app/constants';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private store: Store, private socketService: SocketClientService) {}
    broadcastMsg(username: string, message: string) {
        this.socketService.send('send message', { username, message });
    }

    acceptNewMessages() {
        this.socketService.on('receive message', (chatMessage: ChatMessage) => {
            this.store.dispatch(receivedMessage(chatMessage));
        });
    }

    messageWritten(username: string, message: string) {
        if (message[0] !== '!') {
            this.store.dispatch(receivedMessage({ username, message }));
            this.broadcastMsg(username, message);
        } else {
            const command = message.split(' ');
            switch (command[0]) {
                case '!placer':
                    if (this.validatePlaceCommand(command)) {
                        this.store.dispatch(placeWord({ position: command[1], letters: command[2] }));
                    } else {
                        this.store.dispatch(receivedMessage({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                case '!échanger':
                    if (this.validateExchangeCommand(command)) {
                        this.store.dispatch(exchangeLetters({ letters: command[1] }));
                    } else {
                        this.store.dispatch(receivedMessage({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                case '!passer':
                    if (command.length === 1) {
                        this.handleSkipCommand(command);
                    } else {
                        this.store.dispatch(receivedMessage({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                default:
                    this.store.dispatch(receivedMessage({ username: 'Error', message: 'Entrée invalide' }));
                    return;
            }
        }
    }

    handleSkipCommand(command: string[]): void {
        const commandLine = command[0].slice(1, command[0].length);
        this.socketService.send('command', commandLine);
    }

    private validatePlaceCommand(command: string[]): boolean {
        let commandIsCorrect = false;
        if (!(command.length === 3)) return false;
        commandIsCorrect = true;
        commandIsCorrect &&= /^[a-o]*$/.test(command[1][0]);
        commandIsCorrect &&= /^[a-z0-9]*$/.test(command[1]);
        commandIsCorrect &&= /^[a-zA-Z]*$/.test(command[2]);
        const columnNumber = parseInt(command[1].replace(/^\D+/g, ''), 10); // Prend les nombres d'un string
        const minColumnNumber = 1;
        const maxColumnNumber = BOARD_SIZE;
        commandIsCorrect &&= minColumnNumber <= columnNumber && columnNumber <= maxColumnNumber;
        if (command[1].slice(POSITION_LAST_CHAR) === 'h') {
            commandIsCorrect &&= columnNumber + command[2].length <= BOARD_SIZE;
        } else if (command[1].slice(POSITION_LAST_CHAR) === 'v') {
            commandIsCorrect &&= command[1][0].charCodeAt(0) - ASCII_ALPHABET_POSITION + command[2].length <= BOARD_SIZE;
        }
        if (command[2].length > 1) {
            commandIsCorrect &&= /^[vh]$/.test(command[1].slice(POSITION_LAST_CHAR));
        }
        return commandIsCorrect;
    }

    private validateExchangeCommand(command: string[]): boolean {
        return /^[a-z]*$/.test(command[1]) && command.length === 2;
    }
}
