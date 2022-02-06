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

    validatePlaceCommand(command: string[]): boolean {
        command;
        return true;
    }

    validateExchangeCommand(command: string[]): boolean {
        command;
        return true;
    }
}
