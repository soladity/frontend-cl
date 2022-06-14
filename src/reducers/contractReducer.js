import {
  RELOAD_CONTRACT_STATUS,
  SET_MASS_HUNT_RESULT,
  INIT_MASS_HUNT_RESULT,
  UPDATE_STORE,
} from "../actions/contractActions";

const TUTORIAL_STEPS = {
  1: {
    desc: "Click here to go the warrior page!",
  },
  2: {
    desc: "Click here to choose how many warriors you want to summon!",
  },
  3: {
    desc: "Summon your first warrior!",
  },
  4: {
    desc: "You will need at least 2200 Total Attack Power Summon more Warriors!",
  },
  5: {
    desc: "Summon more warriors!",
  },
  6: {
    desc: "Remember how many warriors you have!",
  },
  7: {
    desc: "Now go to the Beasts page!",
  },
};

let initalState = {
  reloadContractStatus: new Date(),
  massHuntResult: [],
  tutorialStep: [1],
  tutorialKeyWord: "",
  tutorialForPopover: false,
  stepInfo: TUTORIAL_STEPS,
  tutorialOn: false,
  isSmallerThanMD: false,
  isSideBarOpen: false,
  claimInfo: {
    BLSTReward: 0,
    BUSDReward: 0,
  },
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

    case UPDATE_STORE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
