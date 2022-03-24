import {
  RELOAD_CONTRACT_STATUS,
  SET_MASS_HUNT_RESULT,
  INIT_MASS_HUNT_RESULT,
} from "../actions/contractActions";

let initalState = {
  reloadContractStatus: new Date(),
  massHuntResult: [],
};

export const contractReducer = (state = initalState, action) => {
  switch (action.type) {
    case RELOAD_CONTRACT_STATUS:
      return {
        ...state,
        ...action.payload,
      };

    case SET_MASS_HUNT_RESULT:
      return {
        ...state,
        massHuntResult: [...state.massHuntResult, action.payload],
      };

    case INIT_MASS_HUNT_RESULT:
      return {
        ...state,
        massHuntResult: [],
      };

    default:
      return state;
  }
};
