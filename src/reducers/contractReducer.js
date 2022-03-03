import { RELOAD_CONTRACT_STATUS, SET_BEAST_IDS } from '../actions/contractActions'

let initalState = {
    reloadContractStatus: new Date(),
    beastIds: []
}

export const contractReducer = (state = initalState, action) => {
    switch (action.type) {
        case RELOAD_CONTRACT_STATUS:
            return {
                ...state,
                ...action.payload
            };

        case SET_BEAST_IDS:
            return {
                ...state,
                beastIds: action.payload
            };

        default:
            return state;
    }
};
