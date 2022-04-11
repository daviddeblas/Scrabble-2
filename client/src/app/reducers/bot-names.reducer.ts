import * as botNamesActions from '@app/actions/bot-names.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';

export const dictionariesFeatureKey = 'dictionaries';

export const initialState: { easyBots: string[]; hardBots: string[] } = { easyBots: [], hardBots: [] };

export const reducer = createReducer(
    initialState,
    on(botNamesActions.loadBotNamesSuccess, (state, { names }) => names),
    on(botNamesActions.addBotName, (state, { name, difficulty }) => {
        const newState = { easyBots: [...state.easyBots], hardBots: [...state.hardBots] };
        switch (difficulty) {
            case 'easy':
                newState.easyBots.push(name);
                break;
            case 'hard':
                newState.hardBots.push(name);
                break;
        }
        return newState;
    }),
    on(botNamesActions.modifyBotName, (state, { oldName, newName, difficulty }) => {
        const newState = { easyBots: [...state.easyBots], hardBots: [...state.hardBots] };
        switch (difficulty) {
            case 'easy':
                newState.easyBots[newState.easyBots.findIndex((e) => e === oldName)] = newName;
                break;
            case 'hard':
                newState.hardBots[newState.hardBots.findIndex((e) => e === oldName)] = newName;
                break;
        }
        return newState;
    }),

    on(botNamesActions.deleteBotName, (state, { name, difficulty }) => {
        const newState = { easyBots: [...state.easyBots], hardBots: [...state.hardBots] };
        switch (difficulty) {
            case 'easy':
                newState.easyBots = newState.easyBots.filter((n) => name !== n);
                break;
            case 'hard':
                newState.hardBots = newState.hardBots.filter((n) => name !== n);
                break;
        }
        return newState;
    }),

    on(resetAllState, () => initialState),
);
