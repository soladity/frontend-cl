import {
  RELOAD_CONTRACT_STATUS,
  SET_MASS_HUNT_RESULT,
  INIT_MASS_HUNT_RESULT,
  UPDATE_STORE,
} from "../actions/contractActions";

const TUTORIAL_STEPS = {
  0: {
    desc: "You can always restart the tutorial by clicking here",
  },
  1: {
    desc: "Click here to go the Warriors page",
  },
  2: {
    desc: "Click here to choose how many warriors you want to summon",
  },
  3: {
    desc: "Summon your first warrior",
  },
  4: {
    desc: "You will need at least 2200 Total Attack Power Summon more Warriors",
  },
  5: {
    desc: "Summon more warriors",
  },
  6: {
    desc: "Remember how many warriors you have",
  },
  7: {
    desc: "Now go to the Beasts page",
  },
  8: {
    desc: "Click here to choose how many beasts you want to summon",
  },
  9: {
    desc: "Summon your first beast",
  },
  10: {
    desc: "Until the Total Capacity of All Beasts reaches the amount of Warriors you have",
  },
  11: {
    desc: "Summon more beasts",
  },
  12: {
    desc: "Now let's create your first legion",
  },
  13: {
    desc: "Switch between Warriors and Beasts here, and Click on the Warriors and Beasts to add them to your legion",
  },
  14: {
    desc: "Give your legion a name, and Once you reach enough attack power, click here to create your legion",
  },
  15: {
    desc: "Click here to add hunting supplies",
  },
  16: {
    desc: "Buy hunting supplies",
  },
  17: {
    desc: "Go to the Hunt page",
  },
  18: {
    desc: "Attack the strongest monster your legion can hunt by clicking the orange Hunt button",
  },
  19: {
    desc: "The money you win will go to the unclaimed wallet here",
  },
  20: {
    desc: "You can find detailed instructions in our Whitepaper here",
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
