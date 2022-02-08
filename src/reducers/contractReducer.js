import { RELOAD_CONTRACT_STATUS } from '../actions/contractActions'

let initalState = {
    reloadContractStatus: new Date()
}

export const contractReducer = (state = initalState, action) => {
    switch (action.type) {
        case RELOAD_CONTRACT_STATUS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};
