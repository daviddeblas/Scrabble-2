import { Injectable } from '@angular/core';
import { chatMessageReceived } from '@app/actions/chat.actions';
import { exchangeLetters, placeWord, skipTurn } from '@app/actions/player.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { stringToLetters } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Direction, Word } from '@app/classes/word';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';
const POSITION_LAST_CHAR = -1;
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
            this.store.dispatch(chatMessageReceived(chatMessage));
        });
    }

    messageWritten(username: string, message: string) {
        if (message[0] !== '!') {
            this.store.dispatch(chatMessageReceived({ username, message }));
            this.broadcastMsg(username, message);
        } else {
            const command = message.split(' ');
            switch (command[0]) {
                case '!placer': {
                    if (this.validatePlaceCommand(command)) {
                        let placedWord: Word;
                        let position: Vec2;
                        if (/^[vh]$/.test(command[1].slice(POSITION_LAST_CHAR))) {
                            position = { x: parseInt(command[1].slice(0), 10), y: parseInt(command[1].slice(1, POSITION_LAST_CHAR), 10) };
                            placedWord = new Word(
                                stringToLetters(command[2]),
                                position,
                                command[1].slice(POSITION_LAST_CHAR) === 'h' ? Direction.HORIZONTAL : Direction.VERTICAL,
                            );
                        } else {
                            position = { x: parseInt(command[1].slice(0), 10), y: parseInt(command[1].substring(1), 10) };
                            placedWord = new Word(stringToLetters(command[2]), position);
                        }
                        this.store.dispatch(placeWord({ word: placedWord }));
                    } else {
                        this.store.dispatch(chatMessageReceived({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                }
                case '!échanger': {
                    if (this.validateExchangeCommand(command)) {
                        this.store.dispatch(exchangeLetters({ letters: stringToLetters(command[1]) }));
                    } else {
                        this.store.dispatch(chatMessageReceived({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                }
                case '!passer': {
                    if (command.length === 1) {
                        this.store.dispatch(skipTurn());
                    } else {
                        this.store.dispatch(chatMessageReceived({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                }
                default: {
                    this.store.dispatch(chatMessageReceived({ username: 'Error', message: 'Commande impossible à réalisée' }));
                    return;
                }
            }
            this.store.dispatch(chatMessageReceived({ username, message }));
        }
    }

    private validatePlaceCommand(command: string[]): boolean {
        let commandIsCorrect = false;
        if (command.length === 3) {
            commandIsCorrect = true;
            commandIsCorrect &&= /^[a-o]*$/.test(command[1][0]);
            commandIsCorrect &&= /^[a-z0-9]*$/.test(command[1]);
            commandIsCorrect &&= /^[a-z]*$/.test(command[2]);
            const columnNumber = parseInt(command[1].replace(/^\D+/g, ''), 10); // Prend les nombres d'un string
            const minColumnNumber = 1;
            const maxColumnNumber = 15;
            commandIsCorrect &&= columnNumber >= minColumnNumber && columnNumber <= maxColumnNumber;
            if (command[2].length > 1) {
                commandIsCorrect &&= /^[vh]$/.test(command[1].slice(POSITION_LAST_CHAR));
            }
        }
        return commandIsCorrect;
    }

    private validateExchangeCommand(command: string[]): boolean {
        // Verifier que seulement des lettres sont présente dans la commande
        return /^[a-z]*$/.test(command[1]) && command.length === 2;
    }
}
