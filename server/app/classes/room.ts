import { BotDifficulty, BotService } from '@app/services/bot.service';
import { CommandService } from '@app/services/command.service';
import { GameConfigService } from '@app/services/game-config.service';
import { RoomsManager } from '@app/services/rooms-manager.service';
import { GameOptions } from 'common/classes/game-options';
import { RoomInfo } from 'common/classes/room-info';
import { MIN_BOT_PLACEMENT_TIME } from 'common/constants';
import io from 'socket.io';
import { Container } from 'typedi';
import { GameFinishStatus } from './game-finish-status';
import { GameError, GameErrorType } from './game.exception';
import { Game } from './game/game';

export class Room {
    started: boolean;
    clients: (io.Socket | null)[];
    clientName: string | null;
    game: Game | null;
    commandService: CommandService;
    botService: BotService;
    botLevel: string | undefined;

    sockets: io.Socket[];
    private playersLeft: number;

    constructor(public host: io.Socket, public manager: RoomsManager, public gameOptions: GameOptions) {
        this.clients = new Array(1);
        this.started = false;
        this.host.once('quit', () => this.quitRoomHost());
        this.host.once('switch to solo room', (data) => {
            this.initSoloGame(data.botLevel);
            this.host.emit('switched to solo', this.getRoomInfo());
        });
        this.game = null;
        this.clientName = null;
        this.commandService = Container.get(CommandService);
        this.botService = Container.get(BotService);
        this.botLevel = undefined;
        this.playersLeft = 2;
    }

    join(socket: io.Socket, name: string): void {
        this.host.emit('player joining', name);
        this.clientName = name;
        this.clients[0] = socket;
        const client = socket;
        this.host.once('accept', () => this.inviteAccepted(client));
        this.host.once('refuse', () => this.inviteRefused(client));
        client.once('cancel join room', () => this.quitRoomClient());
    }

    quitRoomHost(): void {
        if (this.clients[0]) this.inviteRefused(this.clients[0]);
        this.manager.removeRoom(this);
        this.manager.notifyAvailableRoomsChange();
    }

    inviteAccepted(client: io.Socket): void {
        client.emit('accepted');
        this.initGame();
    }

    inviteRefused(client: io.Socket): void {
        client.emit('refused');
        this.clients[0] = null;
        this.clientName = null;
    }

    quitRoomClient(): void {
        if (this.game !== null) return;
        this.host.emit('player joining cancel');
        this.clients[0] = null;
        this.clientName = null;
    }

    initiateRoomEvents() {
        this.sockets = [this.host as io.Socket];
        if (this.clients[0]) this.sockets.push(this.clients[0]);
        this.sockets.forEach((s, i) => {
            this.setupSocket(s, i);
        });
    }

    initGame(): void {
        this.sockets = [this.host, this.clients[0] as io.Socket];

        this.game = new Game(
            Container.get(GameConfigService).configs[0],
            [this.gameOptions.hostname, this.clientName as string],
            this.gameOptions,
            this.actionAfterTimeout(this),
            () => {
                return;
            },
        );

        this.manager.removeSocketFromJoiningList(this.sockets[1]);
        this.manager.notifyAvailableRoomsChange();

        this.initiateRoomEvents();
    }

    surrenderGame(looserId: string) {
        if (!this.game?.players) throw new GameError(GameErrorType.GameNotExists);

        const winnerName = looserId === this.host.id ? this.clientName : this.gameOptions.hostname;
        this.game.stopTimer();
        this.game.endGame();
        const looserName = looserId === this.host.id ? this.gameOptions.hostname : this.clientName;
        const surrenderMessage = looserName + ' à abandonné la partie';
        const gameFinishStatus: GameFinishStatus = new GameFinishStatus(this.game.players, this.game.bag.letters.length, winnerName);
        this.sockets.forEach((socket, index) => {
            socket.emit('turn ended');
            socket.emit('receive message', { username: '', message: surrenderMessage, messageType: 'System' });
            socket.emit('end game', gameFinishStatus.toEndGameStatus(index));
        });
        if (--this.playersLeft <= 0) {
            this.manager.removeRoom(this);
        }
    }

    getRoomInfo(): RoomInfo {
        return new RoomInfo(this.host.id, this.gameOptions);
    }

    removeUnneededListeners(socket: io.Socket): void {
        socket
            .removeAllListeners('send message')
            .removeAllListeners('surrender game')
            .removeAllListeners('get game status')
            .removeAllListeners('command');
    }

    initSoloGame(diff: BotDifficulty): void {
        this.sockets = [this.host];
        this.playersLeft--;
        let botName: string;

        while ((botName = this.botService.getName()) === this.gameOptions.hostname);
        this.game = new Game(
            Container.get(GameConfigService).configs[0],
            [this.gameOptions.hostname, botName],
            this.gameOptions,
            this.actionAfterTimeout(this),
            this.actionAfterTurnWithBot(this, diff),
        );

        this.manager.notifyAvailableRoomsChange();
        this.setupSocket(this.sockets[0], 0);
        this.botLevel = diff;
    }

    private setupSocket(socket: io.Socket, playerNumber: number): void {
        const game = this.game as Game;
        socket.on('get game status', () => {
            socket.emit('game status', game.getGameStatus(playerNumber, this.botLevel));
        });

        // Initialise le traitement des commandes
        socket.on('command', (command) => this.commandService.onCommand(this.game as Game, this.sockets, command, playerNumber));

        // Initialise le chat
        socket.on('send message', ({ username, message, messageType }) => {
            this.sockets.forEach((s, i) => {
                if (i !== playerNumber) s.emit('receive message', { username, message, messageType });
            });
            if (message.includes(' a quitté le jeu') && messageType === 'System') {
                if (--this.playersLeft <= 0) {
                    this.manager.removeRoom(this);
                }
            }
        });

        // Initialise l'abbandon de la partie
        socket.on('surrender game', () => {
            this.surrenderGame(socket.id);
        });
    }

    private actionAfterTurnWithBot(room: Room, diff: BotDifficulty): () => void {
        return () => {
            const timeForSocketsResponse = 200;
            setTimeout(() => {
                const game = this.game as Game;
                if (game.activePlayer === 1 && !game.gameFinished) {
                    let date = new Date();
                    const startDate = date.getTime();
                    const botCommand = room.botService.move(game, diff);
                    date = new Date();
                    const timeTaken = date.getTime() - startDate;
                    setTimeout(() => {
                        room.commandService.onCommand(game, room.sockets, botCommand, 1);
                    }, Math.max(MIN_BOT_PLACEMENT_TIME - timeTaken, 0));
                }
            }, timeForSocketsResponse);
        };
    }

    private actionAfterTimeout(room: Room): () => void {
        return () => {
            const game = room.game as Game;
            room.commandService.processSkip(game, room.sockets, [], game.activePlayer as number);
            room.commandService.postCommand(game, room.sockets);
            if (game.needsToEnd()) {
                room.commandService.endGame(game, room.sockets);
            }
        };
    }
}
