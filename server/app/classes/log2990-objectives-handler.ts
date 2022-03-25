import { LOG2990OBJECTIVES } from '@app/constantes';
import { Log2990Objective } from 'common/interfaces/log2990-objectives';

export enum Objectives {
    OBJECTIVE0,
    OBJECTIVE1,
    OBJECTIVE2,
    OBJECTIVE3,
    OBJECTIVE4,
    OBJECTIVE5,
    OBJECTIVE6,
    OBJECTIVE7,
}

export class Log2990ObjectivesHandler {
    hostObjectives: Log2990Objective[];
    clientObjectives: Log2990Objective[];
    constructor() {
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

    verifyObjectives(playerNumber: number): number {
        return playerNumber;
    }

    private determineObjective(objectiveNumber: number): Log2990Objective {
        if (objectiveNumber === Objectives.OBJECTIVE7) {
            // get a word
        }
        return LOG2990OBJECTIVES[objectiveNumber];
    }
}
