/* eslint-disable dot-notation */
import { LOG2990OBJECTIVES } from '@app/constantes';
import { expect } from 'chai';
import { restore, stub } from 'sinon';
import { Game } from './game/game';
import { Log2990ObjectivesHandler } from './log2990-objectives-handler';

describe('Log2990 Objective Handler', () => {
    let log2990ObjectiveHandler: Log2990ObjectivesHandler;
    beforeEach(() => {
        log2990ObjectiveHandler = new Log2990ObjectivesHandler();
    });
    afterEach(() => {
        restore();
    });

    it('constructor and setUpPlayerObjectives should give 3 objectives to host and client', () => {
        expect(log2990ObjectiveHandler['clientObjectives'].length).to.equal(3);
        expect(log2990ObjectiveHandler['hostObjectives'].length).to.equal(3);
        expect(log2990ObjectiveHandler['clientObjectives'][0]).to.equal(log2990ObjectiveHandler['hostObjectives'][0]);
        expect(log2990ObjectiveHandler['clientObjectives'][1]).to.equal(log2990ObjectiveHandler['hostObjectives'][1]);
    });

    it('switchingPlayersObjectives should switch the objectives of players', () => {
        const oldHostObjectives = log2990ObjectiveHandler['hostObjectives'];
        const oldClientObjectives = log2990ObjectiveHandler['clientObjectives'];
        log2990ObjectiveHandler.switchingPlayersObjectives();
        expect(log2990ObjectiveHandler['clientObjectives']).to.equal(oldHostObjectives);
        expect(log2990ObjectiveHandler['hostObjectives']).to.equal(oldClientObjectives);
    });

    describe('Verify Objectives', () => {
        it('verifyObjectives should call verifyFirstObjective if the Objective is the first one', () => {
            log2990ObjectiveHandler['hostObjectives'] = [LOG2990OBJECTIVES[0]];
            const objectiveStub = stub(log2990ObjectiveHandler['objectivesVerifier'], 'verifyFirstObjective');
            log2990ObjectiveHandler.verifyObjectives(0, [], 0, { board: { getAffectedWords: () => [[]] } } as unknown as Game);
            expect(objectiveStub.calledOnce).to.equal(true);
        });
        it('verifyObjectives should call verifySecondObjective if the Objective is the second one', () => {
            log2990ObjectiveHandler['hostObjectives'] = [LOG2990OBJECTIVES[1]];
            const objectiveStub = stub(log2990ObjectiveHandler['objectivesVerifier'], 'verifySecondObjective');
            log2990ObjectiveHandler.verifyObjectives(0, [], 0, { board: { getAffectedWords: () => [[]] } } as unknown as Game);
            expect(objectiveStub.calledOnce).to.equal(true);
        });
        it('verifyObjectives should call verifyThirdObjective if the Objective is the third one', () => {
            log2990ObjectiveHandler['clientObjectives'] = [LOG2990OBJECTIVES[2]];
            const objectiveStub = stub(log2990ObjectiveHandler['objectivesVerifier'], 'verifyThirdObjective');
            log2990ObjectiveHandler.verifyObjectives(1, [], 0, { board: { getAffectedWords: () => [[]] } } as unknown as Game);
            expect(objectiveStub.calledOnce).to.equal(true);
        });
        it('verifyObjectives should call verifyFourthObjective if the Objective is the fourth one', () => {
            log2990ObjectiveHandler['clientObjectives'] = [LOG2990OBJECTIVES[3]];
            const objectiveStub = stub(log2990ObjectiveHandler['objectivesVerifier'], 'verifyFourthObjective');
            log2990ObjectiveHandler.verifyObjectives(1, [], 0, { board: { getAffectedWords: () => [[]] } } as unknown as Game);
            expect(objectiveStub.calledOnce).to.equal(true);
        });
        it('verifyObjectives should call verifySixthObjective if the Objective is the sixth one', () => {
            log2990ObjectiveHandler['clientObjectives'] = [LOG2990OBJECTIVES[5]];
            const objectiveStub = stub(log2990ObjectiveHandler['objectivesVerifier'], 'verifySixthObjective');
            log2990ObjectiveHandler.verifyObjectives(1, [], 0, { board: { getAffectedWords: () => [[]] } } as unknown as Game);
            expect(objectiveStub.calledOnce).to.equal(true);
        });
        it('verifyObjectives should call verifySeventhObjective if the Objective is the seventh one', () => {
            log2990ObjectiveHandler['clientObjectives'] = [LOG2990OBJECTIVES[6]];
            const objectiveStub = stub(log2990ObjectiveHandler['objectivesVerifier'], 'verifySeventhObjective');
            log2990ObjectiveHandler.verifyObjectives(1, [], 0, { board: { getAffectedWords: () => [[]] } } as unknown as Game);
            expect(objectiveStub.calledOnce).to.equal(true);
        });

        it('verifyObjectives should not call verifySeventhObjective if the Objective isValidated', () => {
            log2990ObjectiveHandler['clientObjectives'] = [LOG2990OBJECTIVES[0], LOG2990OBJECTIVES[6]];
            log2990ObjectiveHandler['clientObjectives'][1].isValidated = true;
            const objectiveStub = stub(log2990ObjectiveHandler['objectivesVerifier'], 'verifySeventhObjective');
            log2990ObjectiveHandler.verifyObjectives(1, [], 0, { board: { getAffectedWords: () => [[]] } } as unknown as Game);
            expect(objectiveStub.called).to.equal(false);
        });
    });
});
