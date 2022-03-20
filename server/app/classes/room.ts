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
    game: Game | null;
    sockets: io.Socket[];
    commandService: CommandService;

    private clientName: string | null;
    private botService: BotService;
    private botLevel: string | undefined;
    private playersLeft: number;

    constructor(public host: io.Socket, private manager: RoomsManager, private gameOptions: GameOptions) {
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

    removeUnneededListeners(socket: io.Socket): void {
        socket
            .removeAllListeners('send message')
            .removeAllListeners('surrender game')
            .removeAllListeners('get game status')
            .removeAllListeners('command');
    }

    getRoomInfo(): RoomInfo {
        return new RoomInfo(this.host.id, this.gameOptions);
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
            this.actionAfterTimeout(),
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

    initSoloGame(diff: BotDifficulty): void {
        this.sockets = [this.host];
        this.playersLeft--;
        let botName: string;

        while ((botName = this.botService.getName()) === this.gameOptions.hostname);
        this.game = new Game(
            Container.get(GameConfigService).configs[0],
            [this.gameOptions.hostname, botName],
            this.gameOptions,
            this.actionAfterTimeout(),
            this.actionAfterTurnWithBot(this, diff),
        );

        this.manager.notifyAvailableRoomsChange();
        this.setupSocket(this.sockets[0], 0);
        this.botLevel = diff;
    }

    quitRoomHost(): void {
        if (this.clients[0]) this.inviteRefused(this.clients[0]);
        this.manager.removeRoom(this);
        this.manager.notifyAvailableRoomsChange();
    }

    private inviteAccepted(client: io.Socket): void {
        client.emit('accepted');
        this.initGame();
    }

    private inviteRefused(client: io.Socket): void {
        client.emit('refused');
        this.clients[0] = null;
        this.clientName = null;
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
        };
    }

    private actionAfterTimeout(): () => void {
        return this.commandService.actionAfterTimeout(this);
    }
}
