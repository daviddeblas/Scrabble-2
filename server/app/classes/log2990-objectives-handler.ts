import { LOG2990OBJECTIVES } from '@app/constantes';
import { ObjectivesVerifierService } from '@app/services/objectives-verifier.service';
import { Log2990Objective } from 'common/interfaces/log2990-objectives';
import { Container } from 'typedi';
import { BONUS_POINTS_FOR_FULL_EASEL, Game } from './game/game';
import { PlacedLetter } from './placed-letter';

export enum Objectives {
    OBJECTIVE0 = 'Créer un palindrome de 4 lettres ou plus',
    OBJECTIVE1 = 'Placer 3 ou plus consonnes seulement',
    OBJECTIVE2 = "Ralonger le début et la fin d'un mot existant de plus de deux lettres",
    OBJECTIVE3 = 'Faire un placement rapportant plus de 20 points dans les 10 premières secondes du tour',
    OBJECTIVE4 = '?',
    OBJECTIVE5 = 'Faire un mot de plus de 10 lettres',
    OBJECTIVE6 = 'Avoir exactement 69 points',
    OBJECTIVE7 = 'Placer le mot : ',
}

export class Log2990ObjectivesHandler {
    hostObjectives: Log2990Objective[];
    clientObjectives: Log2990Objective[];
    objectivesVerifier: ObjectivesVerifierService;
    constructor() {
        this.hostObjectives = [];
        this.clientObjectives = [];
        this.objectivesVerifier = Container.get(ObjectivesVerifierService);
        this.setUpPlayerObjectives();
    }

    verifyObjectives(playerNumber: number, placedLetters: PlacedLetter[], score: number, game: Game): number {
        const objectiveList = playerNumber === 0 ? this.hostObjectives : this.clientObjectives;
        const createdWords = game.board.getAffectedWords(placedLetters);
        const amountLettersForBonus = 7;
        let bonusAmount = 0;
        for (const objective of objectiveList) {
            const startScore = score;
            if (objective.isValidated) continue;
            switch (objective.description) {
                case Objectives.OBJECTIVE0:
                    score *= this.objectivesVerifier.verifyFirstObjective(createdWords);
                    break;
                case Objectives.OBJECTIVE1:
                    score += this.objectivesVerifier.verifySecondObjective(placedLetters);
                    break;
                case Objectives.OBJECTIVE2:
                    score += this.objectivesVerifier.verifyThirdObjective(placedLetters);
                    break;
                case Objectives.OBJECTIVE3:
                    score += this.objectivesVerifier.verifyFourthObjective(game, score);
                    break;
                case Objectives.OBJECTIVE4:
                    score += this.objectivesVerifier.verifyFifthObjective(placedLetters, game);
                    break;
                case Objectives.OBJECTIVE5:
                    score += this.objectivesVerifier.verifySixthObjective(createdWords);
                    break;
                case Objectives.OBJECTIVE6:
                    if (placedLetters.length === amountLettersForBonus) bonusAmount = BONUS_POINTS_FOR_FULL_EASEL;
                    score += this.objectivesVerifier.verifySeventhObjective(game.players[playerNumber].score + score + bonusAmount);
                    break;
                case Objectives.OBJECTIVE7:
                    score += this.objectivesVerifier.verifyFourthObjective(game, score);
                    break;
            }
            if (startScore !== score) objective.isValidated = true;
        }
        return score;
    }

    switchingPlayersObjectives(): void {
        const tempList = this.hostObjectives;
        this.hostObjectives = this.clientObjectives;
        this.clientObjectives = tempList;
    }

    private setUpPlayerObjectives(): void {
        const amountObjectivesToFind = 4;
        const totalAmountObjectives = 8;
        const objectives = new Set<number>();
        while (objectives.size !== amountObjectivesToFind) {
            objectives.add(Math.floor(Math.random() * totalAmountObjectives));
        }
        const publicObjectives = 2;
        for (let index = 0; index < publicObjectives; index++) {
            const publicObjective = this.determineObjective([...objectives][index]);
            this.hostObjectives.push(publicObjective);
            this.clientObjectives.push(publicObjective);
        }
        const hostPrivateObjectiveIndex = 2;
        this.hostObjectives.push(this.determineObjective([...objectives][hostPrivateObjectiveIndex]));
        const clientPrivateObjectiveIndex = 3;
        this.clientObjectives.push(this.determineObjective([...objectives][clientPrivateObjectiveIndex]));
    }

    private determineObjective(objectiveNumber: number): Log2990Objective {
        const objective = LOG2990OBJECTIVES[objectiveNumber];
        if (objective.description === Objectives.OBJECTIVE7) {
            // get a word
        }
        return objective;
    }
}
