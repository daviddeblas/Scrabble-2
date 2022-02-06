import { Injectable } from '@angular/core';
import { chatMessageReceived } from '@app/actions/chat.actions';
import { ChatMessage } from '@app/classes/chat-message';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private store: Store, private socketService: SocketClientService) {}
    sendMsg(username: string, message: string) {
        this.socketService.send('send message', { username, message });
    }

    acceptNewMessages() {
        this.socketService.on('receive message', (chatMessage: ChatMessage) => {
            this.store.dispatch(chatMessageReceived(chatMessage));
        });
    }

    messageWritten(username: string, message: string) {
        if (message[0] !== '!') this.store.dispatch(chatMessageReceived({ username, message }));
        else {
            const command = message.split(' ');
            switch (command[0]) {
                case '!placer': {
                    if (this.validatePlaceCommand(command)) {
                        // Envoyer placer a un autre effect
                    } else {
                        this.store.dispatch(chatMessageReceived({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                }
                case '!échanger': {
                    if (this.validateExchangeCommand(command)) {
                        // Envoyer exchanger a un autre effect
                    } else {
                        this.store.dispatch(chatMessageReceived({ username: 'Error', message: 'Erreur de syntaxe' }));
                        return;
                    }
                    break;
                }
                case '!passer': {
                    if (command.length === 1) {
                        // Appelé le l'effect passé
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
                const positionLastChar = -1;
                commandIsCorrect &&= /^[vh]$/.test(command[1].slice(positionLastChar));
            }
        }
        return commandIsCorrect;
    }

    private validateExchangeCommand(command: string[]): boolean {
        // Verifier que seulement des lettres sont présente dans la commande
        return /^[a-z]*$/.test(command[1]);
    }
}
